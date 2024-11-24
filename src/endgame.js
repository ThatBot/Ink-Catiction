import Button from './button.js';

class Endgame extends Phaser.Scene {
	constructor() {
		super('Endgame');
	}

	init(data) {
		var ranking = data[0];
		console.log(ranking);
		var Players = [data[1],data[2]];
		console.log('Ranking de la partida: ' + ranking);
	}

	preload() {
		this.load.image('end_back', '../assets/ui/spr_menu_background.png');
	}

	create(data) {
		this.end_background = this.add.image(640, 360, 'end_back');

		this.back_button = new Button(this.onCommsBack, 'Back', '64px', this, 160, 650, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 90, 32);

		this.title1 = this.add.text(245, 100, 'Game Ranking', { color: '#452600', fontSize: '96px', fontFamily: 'Metamorphous' });

		this.first = this.add.text(250, 250, 'First Place:', { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
		this.second = this.add.text(250, 350, 'Second Place: ', { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });

		if (this.ranking[1] > this.ranking[2]) {
			this.first_name = this.add.text(350, 250, this.Players[1].name, { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
			this.second_name = this.add.text(350, 350, this.Players[0].name, { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
		} else if (ranking[0] < ranking[1]) {
			this.first_name = this.add.text(350, 250, this.Players[0].name, { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
			this.second_name = this.add.text(350, 350, this.Players[1].name, { color: '#452600', fontSize: '45px', fontFamily: 'Metamorphous' });
		}

	}

	onCommsBack() {
		//this.scene.start('Menu',0); 
	}
}
export default Endgame;
