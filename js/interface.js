$('#about').click(function() {
  $('#modal .modal-title').html('O mapie');
  $('#modal .modal-body').html('Lorem ipsum');
  $('#modal').modal();
  return false;
});

/* Controls
-------------------------------------------------- */
$(".controls .fa-plus").click(function(){
  map.zoomIn();
});

$(".controls .fa-minus").click(function(){
  map.zoomOut();
});

$(".controls .fa-location-arrow").click(function(){
  map.locate({setView: true, maxZoom: 16});
});

$('#tools').on('click', '.controls .fa-chevron-down', function(){
  $('#tools').addClass('tools-max');
  $(this).removeClass('fa-chevron-down').addClass('fa-chevron-up');
  $('#tools .controls').addClass('divider');
});

$('#tools').on('click', '.controls .fa-chevron-up', function(){
  $('#tools').removeClass('tools-max');
  $(this).removeClass('fa-chevron-up').addClass('fa-chevron-down');
  $('#tools .controls').removeClass('divider');
});

