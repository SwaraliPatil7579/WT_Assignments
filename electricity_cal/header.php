<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle ?? 'Electricity Bill Calculator'; ?></title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
    <div class="container">
        <nav class="top-nav">
            <a href="index.php" class="<?php echo basename($_SERVER['PHP_SELF']) === 'index.php' ? 'active' : ''; ?>">Calculator</a>
            <a href="history.php" class="<?php echo basename($_SERVER['PHP_SELF']) === 'history.php' ? 'active' : ''; ?>">History</a>
        </nav>