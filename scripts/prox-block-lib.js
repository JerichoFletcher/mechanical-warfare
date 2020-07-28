module.exports = {
	getLinkedBlock(tile, block, pred){
		entity = tile.ent();
		prox = entity.proximity();
		count = 0;
		prox.each(pred, cons(other => count++));
		return count;
	}
}