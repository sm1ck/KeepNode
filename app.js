// all selectors
const ethereumButton = document.querySelector('.enableEthereumButton');
const showAccount = document.querySelector('.showAccount');
const showStake = document.querySelector('.showStake');
const showAuthBeacon = document.querySelector('.showAuthBeacon');
const showAuthECDSA = document.querySelector('.showAuthECDSA');
const showAuthTBTC = document.querySelector('.showAuthTBTC');
const showETH = document.querySelector('.showETH');
const showBonded = document.querySelector('.showBonded');
const showUnbonded = document.querySelector('.showUnbonded');
const showSlash = document.querySelector('.showSlash');
const showSeized = document.querySelector('.showSeized');
const showBeaconRewards = document.querySelector('.showBeaconRewards');
const showTBTCRewards = document.querySelector('.showTBTCRewards');
const showTBTCBalance = document.querySelector('.showTBTCBalance');
const mainapp = document.querySelector('.mainapp');
const score = document.querySelector('.score');
const punishmentBox = document.querySelector('.punishmentBox');
const err = document.querySelector('.errmsg');

// much thanks https://gist.github.com/knarz for share keep contacts addresses
var keepTokenAddr = '0x343d3dda00415289cdd4e8030f63a4a5a2548ff9';
var tokenStakingAddr = '0x234d2182B29c6a64ce3ab6940037b5C8FdAB608e';
var beaconOperatorAddr = '0xC8337a94a50d16191513dEF4D1e61A6886BF410f';
var bondedECDSAFactoryAddr = '0x9eccf03dfbda6a5e50d7aba14e0c60c2f6c575e6';
var tBTCSortionAddr = '0x20F1f14a42135d3944fEd1AeD2bE13b01c152054';
var keepBondingAddr = '0x60535A59B4e71F908f3fEB0116F450703FB35eD8';
var beaconStatisticsAddr = '0xe5984A30a5DBaF1FfF818A57dD5f30D74a8dfaBf';
var tBTCTokenAddr = '0x7c07C42973047223F80C4A69Bb62D5195460Eb5F';
var tBTCSystemAddr = '0xc3f96306eDabACEa249D2D22Ec65697f38c6Da69';

var web3, addr, operatorsList, totalScore, minUnbonded, minStake, isPunishment, isMobile, keepTokenAbi, tokenStakingAbi, keepBondingAbi, beaconOperatorAbi, beaconStatisticsAbi, tBTCTokenAbi, tBTCSystemAbi, bondedECDSAFactoryAbi, bondedSortitionPoolAbi;

// on click metamask

ethereumButton.addEventListener('click', () => {
    if (!isMobile) {
        runApp();
    } else {
        window.location.href = "https://metamask.app.link/dapp/keepnode.app/";
    }
});

if ('ontouchstart' in window) {
    ethereumButton.addEventListener('touchstart', () => {
        if (!isMobile) {
            runApp();
        } else {
            window.location.href = "https://metamask.app.link/dapp/keepnode.app/";
        }
    });
}

window.addEventListener('load', function() {
    isMobile = false;
    checkMobile();
});

// on change account

ethereum.on('accountsChanged', function (accounts) {
    runApp();
    loader();
});

// helpers

const gt = (a, b) => {
    return web3.utils.toBN(a).gt(web3.utils.toBN(b))
}

const add = (a, b) => {
    return web3.utils.toBN(a).add(web3.utils.toBN(b))
}

const isEmptyArray = (array) => !(Array.isArray(array) && array.length);

const isSameEthAddress = (address1, address2) => {
    return (
        web3.utils.toChecksumAddress(address1) ===
        web3.utils.toChecksumAddress(address2)
    )
}

// Mainnet deployed!

function changeToMainnet() {
    keepTokenAddr = '0x85Eee30c52B0b379b046Fb0F85F4f3Dc3009aFEC';
    tokenStakingAddr = '0x1293a54e160d1cd7075487898d65266081a15458';
    beaconOperatorAddr = '0xdF708431162Ba247dDaE362D2c919e0fbAfcf9DE';
    bondedECDSAFactoryAddr = '0x9eccf03dfbda6a5e50d7aba14e0c60c2f6c575e6';
    tBTCSortionAddr = '0x4b558ff45f08198e00cc13de2ccefb9998e0290e';
    keepBondingAddr = '0x27321f84704a599aB740281E285cc4463d89A3D5';
    beaconStatisticsAddr = '0x3975CE253fF9d586cF08C3898f95064b7a5718E7';
    tBTCTokenAddr = '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa';
    tBTCSystemAddr = '0xe20A5C79b39bC8C363f0f49ADcFa82C2a01ab64a';
}

// get account from click

async function getAccount() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    if (account == addr) {
        return;
    }
    addr = account;
    ethereumButton.innerHTML = "<img src='img/ethereum.png' class='btn-img' aria-hidden='true'> "+account;
    loadALL();
}

// tokens amount and balanceOf method (any abi)

async function getTokensAmount(address, abi) {
    try {
        const amount = await abi.methods.balanceOf(address).call();
        return amount/1e18;
    } catch (err) {
        error(err.stack);
    }
}

// get stake by operator, use beacon operator contract

async function getStakeAmount(address) {
    try {
        const amount = await tokenStakingAbi.methods.eligibleStake(address, beaconOperatorAddr).call();
        return amount/1e18;
    } catch (err) {
        error(err.stack);
    }
}

// get minimum stake amount

async function getMinStakeAmount() {
    try {
        const amount = await tokenStakingAbi.methods.minimumStake().call();
        return amount/1e18;
    } catch (err) {
        error(err.stack);
    }
}

// count stake total value

async function sequenceOperators() {
    var amountstake = 0;
    await Promise.all(operatorsList.map(function(address) {
        return getStakeAmount(address).then(t => {
            amountstake += t;
        });
    }));
    minStake = await Promise.all([getMinStakeAmount()]);
    if (amountstake < minStake[0]) {
        createNodePunishment("Low stake balance", "Your account balance is too low for staking. Minimum stake amount now: "+minStake[0]+". If you have grants, just stake it. See the <a href='https://keep-network.gitbook.io/staking-documentation/token-dashboard/delegate-stake' target='_blank'>guide</a>. If you still see 0, authorize the RandomBeaconOperator contract on <a href='https://dashboard.test.keep.network/applications/random-beacon' target='_blank'>dashboard</a>.", 50, "critical");
    }
    showStake.innerHTML = amountstake+printKEEP();
}

// check authorized

async function isAuthorized(address, operator) {
    try {
        const isAuth = await tokenStakingAbi.methods.isAuthorizedForOperator(address, operator).call();
        return isAuth;
    } catch (err) {
        error(err.stack);
    }
}

async function isTBTCAuthorized(address, operator) {
    try {
        const isAuth = await keepBondingAbi.methods.hasSecondaryAuthorization(address, operator).call();
        return isAuth;
    } catch (err) {
        error(err.stack);
    }
}

// get bonds by address

async function getCreatedBonds(address, pool) {
    try {
        const bonds = await keepBondingAbi.getPastEvents("BondCreated", {
            fromBlock: 0,
            filter: {
                operator: address,
                sortitionPool: pool,
            }
        });
        return bonds;
    } catch (err) {
        error(err.stack);
    }
}

// get bond eth amount by id

async function getBondAmount(operator, holder, referenceID) {
    try {
        const bond = await keepBondingAbi.methods.bondAmount(operator, holder, referenceID).call();
        return bond;
    } catch (err) {
        error(err.stack);
    }
}

// count total eth in bond

async function sequenceBond(cbonds) {
    var total = 0;
    try {
        var map = new Map();
        var i = 0;
        Object.values(cbonds).forEach(function(item) {
            map.set(i, item);
            i++;
        });
        await Promise.all(Array.from(map, ([key, item]) => {
            return getBondAmount(item.returnValues.operator, item.returnValues.holder, item.returnValues.referenceID).then(t => {
                total += parseInt(web3.utils.fromWei(t) * 100) / 100;
            });  
        }));
        if (total == 0) {
            // "ETH is getting bonded when you are selected to a signing group." - @Piotr in discord
            createNodePunishment("No one ETH in bond", "ETH is getting bonded when you are selected to a signing group. This requires more activity in tBTC deposits. Now you need to be patient and have a well-configured node.", 3, "info");
        }
        showBonded.innerHTML = total+printETH();
    } catch (err) {
        error(err.stack);
    }
}

// get unbound eth by address

async function getUnbondAmount(address) {
    try {
        const unbond = await keepBondingAbi.methods.unbondedValue(address).call();
        return unbond;
    } catch (err) {
        error(err.stack);
    }
}

// check slashed

async function isSlashed(address) {
    try {
        const isSlash = await tokenStakingAbi.getPastEvents("TokensSlashed", {
            fromBlock: 0,
            filter: {
                operator: address,
            }
        });
        return isEmptyArray(isSlash) ? false : true;
    } catch (err) {
        error(err.stack);
    }
}

// check seized
// "slash burns all the tokens, seize burns 95% and gives 5% to the reporter
//  seize is only used for the beacon" - @ssh in discord

async function isSeized(address) {
    try {
        const isSeized = await tokenStakingAbi.getPastEvents("TokensSeized", {
            fromBlock: 0,
            filter: {
                operator: address,
            }
        });
        return isEmptyArray(isSeized) ? false : true;
    } catch (err) {
        error(err.stack);
    }
}

// future maybe implement amount of slash

// get group keys for rewards count

async function getGroupPubKeys() {
    try {
        const groupPubKeys = ( await beaconOperatorAbi.getPastEvents("DkgResultSubmittedEvent", {
            fromBlock: 0
        }) ).map((event) => event.returnValues.groupPubKey);
        return groupPubKeys;
    } catch (err) {
        error(err.stack);
    }
}

// get total rewards for random beacon

async function getTotalBeaconRewards(address) {
    try {
        var totalRewardsBalance = web3.utils.toBN(0);
        const groupPubKeys = await getGroupPubKeys();
        const rewards = [];
        const groups = {};
        for (let groupIndex = 0; groupIndex < groupPubKeys.length; groupIndex++) {
            const groupPubKey = groupPubKeys[groupIndex];
            const awaitingRewards = await beaconStatisticsAbi.methods.awaitingRewards(addr, groupIndex).call();
            if (!gt(awaitingRewards, 0)) {
                continue
            }
            var groupInfo = {}
            if (groups.hasOwnProperty(groupIndex)) {
                groupInfo = { ...groups[groupIndex] }
            } else {
                groupInfo = { groupPublicKey: groupPubKey};
                groups[groupIndex] = groupInfo;
            }
            totalRewardsBalance = add(totalRewardsBalance, awaitingRewards);
            rewards.push({
                groupIndex: groupIndex.toString(),
                ...groupInfo,
                operatorAddress: addr,
                reward: web3.utils.fromWei(awaitingRewards),
            });
        }
        return [rewards, web3.utils.fromWei(totalRewardsBalance)];
    } catch (err) {
        error(err.stack);
    }
}

// get tbtc transfers by address

async function getTBTCTransfersBeneficiary(address) {
    try {
        const getTBTC = await tBTCTokenAbi.getPastEvents("Transfer", {
            fromBlock: 0,
            filter: {
                to: web3.utils.toChecksumAddress(address),
            }
        });
        return getTBTC;
    } catch (err) {
        error(err.stack);
    }
}

// get created tBTC event

async function getTBTCCreated(transferEventToBeneficiary) {
    try {
        const getTBTC = await tBTCSystemAbi.getPastEvents("Created", {
            fromBlock: 0,
            filter: {
                _depositContractAddress: isEmptyArray(transferEventToBeneficiary) ? '' : transferEventToBeneficiary.map((_) => _.returnValues.from),
            }
        });
        return getTBTC;
    } catch (err) {
        error(err.stack);
    }
}

// get MinimumBondableValue for accurate

async function fetchMinUnbondedETH(data) {
    try {
        const getPools = await bondedECDSAFactoryAbi.getPastEvents("SortitionPoolCreated", {
            fromBlock: 0,
        });
        var foundMins = [];
        await Promise.all(getPools.map(async item => {
            var pool = item.returnValues.sortitionPool;
            var bondedPoolAbi = new web3.eth.Contract(data, pool);
            const needable = await bondedPoolAbi.methods.getMinimumBondableValue().call();
            foundMins.push(parseInt(web3.utils.fromWei(needable)));
        }));
        var minvalue = foundMins[0];
        for (var i = 0; i < foundMins.length; i++) {
            if(foundMins[i]<minvalue)
            {
                minvalue = foundMins[i];
            }
        }
        minUnbonded = minvalue;
    } catch (err) {
        error(err.stack);
    }
}

// simple formula, lol

function deductScore(amount) {
    if (totalScore >= amount) {
        if (totalScore > (amount * 2)) {
            totalScore -= amount;
        } else {
            totalScore -= Math.round(amount / 2);
        }
    }
}

// add html info about punishment and deduct score

function createNodePunishment(header, msg, amount, mode) {
    if (!isPunishment) {
        isPunishment = true;
        punishmentBox.innerHTML = "<h3 style='text-align: center; margin-bottom: 23px !important;'>Founded issues</h3>";
    }
    deductScore(amount);
    // add msg
    if (mode == "critical") {
        punishmentBox.innerHTML += '<div class="panel panel-danger"><div class="panel-heading"><h3 class="panel-title">'+header+'</h3></div><div class="panel-body">'+msg+'</div></div>';
    } else if (mode == "warn") {
        punishmentBox.innerHTML += '<div class="panel panel-warning"><div class="panel-heading"><h3 class="panel-title">'+header+'</h3></div><div class="panel-body">'+msg+'</div></div>';
    } else {
        // info
        punishmentBox.innerHTML += '<div class="panel panel-info"><div class="panel-heading"><h3 class="panel-title">'+header+'</h3></div><div class="panel-body">'+msg+'</div></div>';
    }
}

// check is mobile

async function checkMobile() {
    const provider = await detectEthereumProvider()
    if (!provider) {
        isMobile = true;
        printMobile();
    }
}

function printMobile() {
    err.innerHTML = "<center><img src='img/qrcode.png'></center><br>";
    err.style.display = 'block';
}

// for load json abi

function loadJSON(path, callback) {
    $.getJSON(path, function(data) {
        callback(data);
    });
}

// handle errors

function error(msg) {
    err.innerHTML = '<div class="alert alert-danger" role="alert"><strong>Error!</strong> '+msg+'</div>';
    err.style.display = 'block';
    setTimeout(() => {
        err.style.display = 'none';
    }, 10000);
}

// info msg to top page

function info(msg) {
    err.innerHTML = '<div class="alert alert-info" role="alert"><strong>Attention!</strong> '+msg+'</div>';
    err.style.display = 'block';
    setTimeout(() => {
        err.style.display = 'none';
    }, 10000);
}

// reload html to awaiting load data

function loader() {
    showBeaconRewards.innerHTML = "<img src='img/loader.gif' class='loader-img' aria-hidden='true'>";
    showTBTCRewards.innerHTML = "<img src='img/loader.gif' class='loader-img' aria-hidden='true'>";
    score.innerHTML = "<div style='text-align: center;'><h3>Total Score of Nodes</h3></div><div style='width: 100%; height: 210px; position: relative'><img src='img/bigloader.gif' style='width: 64px; height: 64px;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);' aria-hidden='true'></div><br>";
}

// print some html data

function printOK() {
    return "<span style='color: green'>✔</span>";
}

function printDeny() {
    return "<span style='color: red'>✘</span>";
}

function printKEEP() {
    return " KEEP";
}

function printETH() {
    return " ETH";
}

function printTBTC() {
    return " tBTC";
}

function printIssue() {
    return "<div style='text-align: center'><h5><a href='#getInfo'>View found issues</a></h5></div>";
}

function scoreGreen() {
    var fetchIssue = "";
    if (totalScore < 100) {
        fetchIssue = printIssue();
    }
    return "<div style='text-align: center;'><h3>Total Score of Nodes</h3></div><div class='green ldBar label-center' style='width: 100%; height: 210px' data-value='"+totalScore+"' data-preset='circle' data-stroke-width='5' data-stroke-dir='reverse'></div>"+fetchIssue+"<br>";
}

function scoreOrange() {
    var fetchIssue = "";
    if (totalScore < 100) {
        fetchIssue = printIssue();
    }
    return "<div style='text-align: center;'><h3>Total Score of Nodes</h3></div><div class='orange ldBar label-center' style='width: 100%; height: 210px' data-value='"+totalScore+"' data-preset='circle' data-stroke-width='5' data-stroke-dir='reverse'></div>"+fetchIssue+"<br>";;
}

function scoreRed() {
    var fetchIssue = "";
    if (totalScore < 100) {
        fetchIssue = printIssue();
    }
    return "<div style='text-align: center;'><h3>Total Score of Nodes</h3></div><div class='red ldBar label-center' style='width: 100%; height: 210px' data-value='"+totalScore+"' data-preset='circle' data-stroke-width='5' data-stroke-dir='reverse'></div>"+fetchIssue+"<br>";;
}

// load application

function loadALL() {
    var start = false;
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    // accurate check current network
    web3.eth.net.getNetworkType().then(t => {
        if (t == "main") {
            changeToMainnet();
            info("If you participate in PFK and you need to check the node in the testnet, please switch to \"Ropsten!\"");
        }
        minUnbonded = 0;
        totalScore = 100;
        isPunishment = false;
        punishmentBox.innerHTML = "";
        // show html via css
        mainapp.style.display = 'block';
        score.style.display = 'block';
        // finish timer
        var timerId = setInterval(() => {
            var selection = document.querySelector('.loader-img') === null;
            if (selection) {
                if (totalScore >= 80) {
                    // green
                    score.innerHTML = scoreGreen();
                } else if (totalScore >= 50) {
                    // orange
                    score.innerHTML = scoreOrange();
                } else {
                    // red
                    score.innerHTML = scoreRed();
                }
                var bar = new ldBar(
                    ".ldBar", {
                    "stroke": '#f00',
                    "stroke-width": 5,
                    "stroke-dir": 'reverse',
                    "preset": "circle",
                    "value": totalScore
                });
                clearInterval(timerId);
            }
        }, 500);
        web3.eth.getBalance(addr, function(err, balance) {
            if (!err) {
                var bal = web3.utils.fromWei(balance);
                showETH.innerHTML = (parseInt(bal * 100) / 100)+printETH();
                if (bal == 0) {
                    createNodePunishment("Low ETH wallet balance", "You need to top up your wallet with Ether. Ether may be needed for some operations, and so on.", 5, "info");
                }
            } else {
                error(err);
            }
        });
        // now use only one operator to check node
        operatorsList = [addr];
        loadJSON("/contracts/KeepToken.json", function ( data ) {
            keepTokenAbi = new web3.eth.Contract(data, keepTokenAddr);
            getTokensAmount(addr, keepTokenAbi).then(t => {
                showAccount.innerHTML = t+printKEEP();
            });
        });
        loadJSON("/contracts/TokenStaking.json", function ( data ) {
            tokenStakingAbi = new web3.eth.Contract(data, tokenStakingAddr);
            sequenceOperators();
            isAuthorized(addr, beaconOperatorAddr).then(t => {
                showAuthBeacon.innerHTML = t ? printOK() : printDeny();
                if (!t) {
                    createNodePunishment("Authorized required", "You need to authorize RandomBeaconOperator contract for Random Beacon Node on <a href='https://dashboard.test.keep.network/applications/random-beacon' target='_blank'>dashboard</a>. Also just check this <a href='https://keep-network.gitbook.io/staking-documentation/token-dashboard/authorize-contracts' target='_blank'>guide</a>.", 50, "critical");
                }
            });
            isAuthorized(addr, bondedECDSAFactoryAddr).then(t => {
                showAuthECDSA.innerHTML = t ? printOK() : printDeny();
                if (!t) {
                    createNodePunishment("Authorized required", "You need to authorize BondedECDSAKeepFactory contract for ECDSA Node on <a href='https://dashboard.test.keep.network/applications/tbtc' target='_blank'>dashboard</a>. Also just check this <a href='https://keep-network.gitbook.io/staking-documentation/token-dashboard/authorize-contracts' target='_blank'>guide</a>.", 50, "critical");
                }
            });
            isSlashed(addr).then(t => {
                showSlash.innerHTML = t ? printDeny() : printOK();
                if (t) {
                    // "Slashing in the Random Beacon is to all members in the group, as there's no way to know who succeeded or failed to participate in the signature process correctly." - @Antonio in discord
                    // "ECDSA keeps if there's proven misbehavior (i.e., the signing group produces an unauthorized signature)." - @Antonio in discord
                    createNodePunishment("You got slashed!", "Slashing is a forced seizure of the delegated tokens for various violations. Slashing in the Random Beacon is to all members in the group, as there's no way to know who succeeded or failed to participate in the signature process correctly. ECDSA node is punished when trying to perform various bad operations for example the signing group produces an unauthorized signature. You can <a href='checknode.html' target='_blank'>check the availability</a> of your node on the Internet.", 20, "warn");
                }
            });
            isSeized(addr).then(t => {
                showSeized.innerHTML = t ? printDeny() : printOK();
                if (t) {
                    createNodePunishment("You got slashed!", "Slashing is a forced seizure of the delegated tokens for various violations. Slashing in the Random Beacon is to all members in the group, as there's no way to know who succeeded or failed to participate in the signature process correctly. ECDSA node is punished when trying to perform various bad operations for example the signing group produces an unauthorized signature. You can <a href='checknode.html' target='_blank'>check the availability</a> of your node on the Internet.", 20, "warn");
                }
            });
        });
        loadJSON("/contracts/KeepBonding.json", function ( data ) {
            keepBondingAbi = new web3.eth.Contract(data, keepBondingAddr);
            isTBTCAuthorized(addr, tBTCSortionAddr).then(t => {
                showAuthTBTC.innerHTML = t ? printOK() : printDeny();
                if (!t) {
                    createNodePunishment("Authorized required", "You need to authorize TBTCSystem contract for ECDSA Node on <a href='https://dashboard.test.keep.network/applications/tbtc' target='_blank'>dashboard</a>. Also just check this <a href='https://keep-network.gitbook.io/staking-documentation/token-dashboard/authorize-contracts' target='_blank'>guide</a>.", 50, "critical");
                }
            });
            getCreatedBonds(addr, tBTCSortionAddr).then(t => {
                sequenceBond(t);
            });
            loadJSON("/contracts/BondedECDSAKeepFactory.json", function ( data ) {
                bondedECDSAFactoryAbi = new web3.eth.Contract(data, bondedECDSAFactoryAddr);
                loadJSON("/contracts/BondedSortitionPool.json", function ( data ) {
                    fetchMinUnbondedETH(data).then(_ => {
                        getUnbondAmount(addr).then(t => {
                            var unbonded = parseInt(web3.utils.fromWei(t) * 100) / 100;
                            if (unbonded < minUnbonded) {
                                createNodePunishment("Low unbonded ETH balance", "Your account balance is too low for be eligible ECDSA node operator. Minimum unbonded ETH amount now: "+minUnbonded+". You can top up unbonded ETH balance via <a href='https://dashboard.test.keep.network/applications/tbtc' target='_blank'>dashboard</a>. Also just check this <a href='https://keep-network.gitbook.io/staking-documentation/token-dashboard/add-eth-for-bonding' target='_blank'>guide</a>.", 25, "warn");
                            }
                            showUnbonded.innerHTML = unbonded+printETH();
                        });
                    });
                });
            });

        });
        loadJSON("/contracts/KeepRandomBeaconOperator.json", function ( data ) {
            beaconOperatorAbi = new web3.eth.Contract(data, beaconOperatorAddr);
            loadJSON("/contracts/KeepRandomBeaconOperatorStatistics.json", function ( data ) {
                beaconStatisticsAbi = new web3.eth.Contract(data, beaconStatisticsAddr);
                getTotalBeaconRewards(addr).then(t => {
                    showBeaconRewards.innerHTML = t[1]+printETH();
                    if (t[1] == 0) {
                        createNodePunishment("You haven't any Random Beacon rewards yet!", "To receive the reward, you need to have a correctly configured Random Beacon Node and just wait a few days after setting it up. Your node should be included in the signing groups. Read more: <a href='https://github.com/keep-network/keep-core/blob/master/docs/random-beacon/pricing.adoc' target='_blank'>github docs</a>.", 10, "info");
                    }
                });
            });
        });
        loadJSON("/contracts/TBTCToken.json", function ( data ) {
            tBTCTokenAbi = new web3.eth.Contract(data, tBTCTokenAddr);
            getTokensAmount(addr, tBTCTokenAbi).then(t => {
                showTBTCBalance.innerHTML = t+printTBTC();
            });
            loadJSON("/contracts/TBTCSystem.json", function ( data ) {
                tBTCSystemAbi = new web3.eth.Contract(data, tBTCSystemAddr);
                getTBTCTransfersBeneficiary(addr).then(t => {
                    getTBTCCreated(t).then(a => {
                        const data = t.filter(({ returnValues: { from } }) =>
                            a.some(
                                ({ returnValues: { _depositContractAddress } }) =>
                                isSameEthAddress(_depositContractAddress, from)
                            )
                        )
                        .map(({ transactionHash, returnValues: { from, value } }) => ({
                            depositTokenId: from,
                            amount: value,
                            transactionHash,
                        }));
                        var tbtcTotalReward = web3.utils.fromWei(web3.utils.toBN(data.map((reward) => reward.amount).reduce(add, 0)));
                        showTBTCRewards.innerHTML = tbtcTotalReward+printTBTC();
                        if (tbtcTotalReward == 0) {
                            // Based on:
                            // "Do I understand correctly, tBTC awards are distributed to operators who launched ECDSA nodes and were selected to groups to sign upon creation of a new btc deposit." - @Herobrine ask in discord
                            // "the rewards are available once the deposit is closed/redeemed (iirc)
                            // but yes, ecdsa signer groups (keeps) are the ones who get the fees" - @ssh in discord
                            createNodePunishment("You haven't any tBTC rewards yet!", "To receive the reward, you need to have a correctly configured ECDSA node and have enough ETH bonded. Rewards are distributed after the closure of the BTC deposit between the signers (group) selected when creating this deposit.", 10, "info");
                        }
                    });
                });
            });
        });
    });
}

// main function

function runApp() {
    getAccount();
}