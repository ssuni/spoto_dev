<div id="log_view">
    <div class="log_row">
    <?php foreach ($comment as $key) : ?>
        <div class="log_data"><?= $key?></div>
    <?php endforeach; ?>
    </div>
 
    <?php foreach ($log as $key) : ?>
        <div class="log_row">
        <?php foreach ($key as $value) : ?>
            <div class="log_data"><?=$value?></div>
        <?php endforeach; ?>
        </div>
    <?php endforeach; ?>
</div> 

<?= $pager->links() ?>  
  