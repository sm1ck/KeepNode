<?php
/*
How back to php from html. Reason is parse address from url.
*/
$addr = (isset($_GET['address']) && !empty($_GET['address'])) ? $_GET['address'] : '';
$net = (isset($_GET['mainnet']) && !empty($_GET['mainnet'])) ? $_GET['mainnet'] : false;
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Check your Keep node | KeepNode.app</title>
    <meta name="description" content="KeepNode.app - check your both Keep nodes just to make sure that everything works fine!">
    <meta property="og:title" content="Check your Keep node | KeepNode.app" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:description" content="KeepNode.app - check your both Keep nodes just to make sure that everything works fine!" />
    <meta property="og:url" content="https://keepnode.app/" />
    <meta property="og:image" content="https://keepnode.app/img/ogkeeplogo.png" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="537" />
    <meta property="og:image:height" content="240" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/loading-bar.min.css">
    <link rel="stylesheet" href="css/style.css">
    <script src="js/jquery-3.5.1.min.js"></script>
    <script src="js/web3.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/ie10-viewport-bug-workaround.js"></script>
    <script src="js/loading-bar.min.js"></script>
    <script src="js/detect-provider.min.js"></script>
  </head>
  <body>
    <div class="container">

        <!-- Static navbar -->
        <nav class="navbar navbar-default">
            <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="/">Check your Keep node</a>
            </div>
            <div id="navbar" class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
                <li class="active"><a href="/">Home</a></li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Tools <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                    <li><a href="checknode.html">Check node available</a></li>
                    </ul>
                </li>
                <li><a href="about.html">About</a></li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                <li><a href="https://github.com/sm1ck/KeepNode" target="_blank">Github</a></li>
                </ul>
            </div><!--/.nav-collapse -->
            </div><!--/.container-fluid -->
        </nav>

        <!-- Main component for a primary marketing message or call to action -->
        <div class="jumbotron">
            <span style='display: none' class='definedAddr'><?php echo $addr ?></span>
            <span style='display: none' class='definedNet'><?php echo $net ?></span>
            <span style='display: none' class='errmsg'></span>
            <div class='score' style='display: none'>
                <div style='text-align: center;'>
                    <h3>Total Score of Nodes</h3>
                </div>
                <div style='width: 100%; height: 210px; position: relative'>
                    <img src='img/bigloader.gif' style='width: 64px; height: 64px;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);' aria-hidden='true'>
                </div>
            </div>
            <button class="btn btn-primary btn-lg btn-block mb-3 enableEthereumButton btncon"><img src='img/metamask-fox.svg' class='btn-img' aria-hidden='true'> Connect with MetaMask</button>
            <div class='mainapp' style='display: none'>
                <br>
                <div class="panel panel-default">
                    <div class="panel-heading">
                    <h3 class="panel-title">Balance</h3>
                    </div>
                    <div class="panel-body">
                        <img src='img/ethereum.png' class='btn-img' aria-hidden='true'>&nbsp; <span class="showETH"><img src='img/loader.gif' class='loader-img' aria-hidden='true'></span><br>
                        <img src='img/keep-token-main.png' class='btn-img' aria-hidden='true'>&nbsp; <span class="showAccount"><img src='img/loader.gif' class='loader-img' aria-hidden='true'></span><br>
                        <img src='img/tbtc.svg' class='btn-img' aria-hidden='true'>&nbsp; <span class="showTBTCBalance"><img src='img/loader.gif' class='loader-img' aria-hidden='true'></span>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="panel-heading">
                    <h3 class="panel-title">Stake</h3>
                    </div>
                    <div class="panel-body">
                        <img src='img/keep-token-black.png' class='btn-img' aria-hidden='true'>&nbsp; <span class="showStake"><img src='img/loader.gif' class='loader-img' aria-hidden='true'></span>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="panel-heading">
                    <h3 class="panel-title">Bond</h3>
                    </div>
                    <div class="panel-body">
                        <img src='img/lock.png' class='btn-img' aria-hidden='true'>&nbsp; <span class="showBonded"><img src='img/loader.gif' class='loader-img' aria-hidden='true'></span><br>
                        <img src='img/unlock.png' class='btn-img' aria-hidden='true'>&nbsp; <span class="showUnbonded"><img src='img/loader.gif' class='loader-img' aria-hidden='true'></span>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="panel-heading">
                    <h3 class="panel-title">Rewards</h3>
                    </div>
                    <div class="panel-body">
                        <img src='img/keep-token-green.png' class='btn-img' aria-hidden='true'>&nbsp; <span class="showBeaconRewards"><img src='img/loader.gif' class='loader-img' aria-hidden='true'></span><br>
                        <img src='img/tbtc.svg' class='btn-img' aria-hidden='true'>&nbsp; <span class="showTBTCRewards"><img src='img/loader.gif' class='loader-img' aria-hidden='true'></span>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="panel-heading">
                    <h3 class="panel-title">Checks of Authorized Contracts</h3>
                    </div>
                    <div class="panel-body">
                        Random Beacon Operator: <span class="showAuthBeacon"><img src='img/loader.gif' class='loader-img' aria-hidden='true'></span><br>
                        Bonded ECDSA: <span class="showAuthECDSA"><img src='img/loader.gif' class='loader-img' aria-hidden='true'></span><br>
                        tBTC System: <span class="showAuthTBTC"><img src='img/loader.gif' class='loader-img' aria-hidden='true'></span>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="panel-heading">
                    <h3 class="panel-title">Other Checks</h3>
                    </div>
                    <div class="panel-body">
                        No One Slashed Tokens: <span class="showSlash"><img src='img/loader.gif' class='loader-img' aria-hidden='true'></span><br>
                        No One Seized Tokens: <span class="showSeized"><img src='img/loader.gif' class='loader-img' aria-hidden='true'></span>
                    </div>
                </div>
                <div id='getInfo' class='punishmentBox'></div>
            </div>
        </div>

    </div> <!-- /container -->
    <script src="app.js"></script>
  </body>
</html>