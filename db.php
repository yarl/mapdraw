<?php
session_start();

$m = new MongoClient();
$db = $m->mapdraw;
$maps = $db->maps; //collection

/**
 * Decoder for JavaScript encodeURIComponent()
 * @param String $str encoded string
 * @return String decoded string
 * @source: http://stackoverflow.com/a/3896595/1418878
 */
function decodeURIComponent($str) { 
  $str = preg_replace("/%u([0-9a-f]{3,4})/i","&#x\\1;",urldecode($str));
  return html_entity_decode($str,null,'UTF-8');;
}
function encodeURIComponent($str) {
    $revert = array('%21'=>'!', '%2A'=>'*', '%27'=>"'", '%28'=>'(', '%29'=>')');
    return strtr(rawurlencode($str), $revert);
}

/**
 * Saving map
 * @source: http://stackoverflow.com/a/8075691/1418878 (generating id)
 */
if ($_POST['action'] === 'save' && ($_SESSION['ip'] == $_SERVER['REMOTE_ADDR'])) {
  $map_id = substr(md5(uniqid(mt_rand(), true)), 0, 6);
  $map_author = $_POST['author'];
  $map_data = json_decode(decodeURIComponent($_POST['data']));
  
  $map = new stdClass();
  $map->id = $map_id;
  $map->author = $map_author;
  $map->data = $map_data;
  
  $maps->insert($map);

  echo $map_id;
} 
/**
 * Loading map
 */
else if ($_POST['action'] === 'load' && ($_SESSION['ip'] == $_SERVER['REMOTE_ADDR'])) {
  $map_id = $_POST['id'];
  //$map_author = $_POST['author'];
  
  $selected = $maps->findOne(array("id" => $map_id));
  echo json_encode($selected);
}

else {
    echo "<html><head>
            <meta charset='utf-8'>
            <meta http-equiv='refresh' content='0; URL=./'>
          </head></html>";
}


// add a record
/*$collection->drop();
$document = array( "title" => "Calvin and Hobbes", "author" => "Bill Watterson" );
$collection->insert($document);

// add another record, with a different "shape"
$document = array( "title" => "XKCD", "online" => true );
$collection->insert($document);*/
/*
// find everything in the collection
$cursor = $collection->find();

// iterate through the results
foreach ($cursor as $document) {
    echo $document["title"] . "\n";
}

echo "<br /><br />".substr(md5(uniqid(mt_rand(), true)), 0, 6);
*/
?>