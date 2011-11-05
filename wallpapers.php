<?php

$hostname = 'localhost';
$username = 'txmafia_athwt';
$password = 'Txvbs9HNtNNJLFE7';
$database = 'txmafia_athwt';

$errors = array();

$id = isset($_GET['id']) !== false && preg_match('/^[a-z0-9]+$/i', $_GET['id']) === 1 ? $_GET['id'] : false;

if ($id !== false) {
	$link = mysql_connect($hostname, $username, $password);
	if ($link !== false) {
		if (mysql_select_db($database, $link) !== false) {
			$sql = "
				SELECT
					e.id_key,
					e.name,
					e.name_short,
					s.name AS season					
				FROM
					episode AS e LEFT JOIN
					season AS s ON
					e.id_season = s.id
				WHERE
					id_key = '" . $id . "'
			";
			
			$result = mysql_query($sql, $link);
			if ($result !== false) {
				if (mysql_num_rows($result) === 1) {
					$success = true;
					$OUT = mysql_fetch_assoc($result);
					include_once 'html/wallpapers.html';
				} else {
					$errors[] = 'Wallpaper does not exist.';
				}
			} else {
				$errors[] = 'Unable to query server.';
			} 
		} else {
			$errors[] = 'Unable to connect to database.';
		}
	} else {
		$errors[] = 'Unable to connect to server.';
	}
} else {
	$errors[] = 'Inavlid episode key.';
}

header('X-JSON: ({"success":' . (sizeof($errors) === 0 ? 'true' : 'false') . '})');

if (sizeof($errors) > 0) {
	var_dump($errors);
}

?>