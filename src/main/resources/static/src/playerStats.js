class PlayerStats {

    constructor(scene, x, y, texture, lifes){
        this.scene = scene;
        this.x = x;
		this.y = y;
        this.lifes = lifes;
        this.texture = texture;
        this.arr_lifes = [];
        this.generateLifes();
        this.isAnimating = false;
    }

    generateLifes(){
    var x_pos = this.x;
    var l;
       for(var i = 0; i < this.lifes; i++){
            this.arr_lifes.push(l = new Life(this.scene, x_pos, this.y, this.texture));
            x_pos += 35;
       }
    }


    loseLife(p_lifes){
        var l;
        if(p_lifes - 1 > 0){
            l = p_lifes - 1;
        }
        else {
            l = 0;
        }
        this.arr_lifes[l].runAnimation(`${this.texture}-life`);
    }


    resetLifes(){
        var x_pos = this.x;
        for(var i = 0; i < this.lifes; i++ ){
            this.arr_lifes[i] = new Life(this.scene, x_pos, this.y, this.texture);
            x_pos += 35;
        }
    }

}

class Life extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture){
        super(scene, x, y, 'Texture');
        this.scene = scene;
        this.x = x;
		this.y = y;
        this.texture = texture;
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, this.texture);
        this.sprite.depth = 10;
        this.sprite.setScale(4);
        this.createAnimations();
    }

    createAnimations(){
        this.scene.anims.create({
            key: `${this.texture}-life`,
            frames: this.scene.anims.generateFrameNumbers(`${this.texture}`, { start: 0, end: 7 }),
            frameRate: 10,
            repeat: 0
        });
    }

    runAnimation(animation){
        this.sprite.play(animation, true);
    }
}


export default PlayerStats;