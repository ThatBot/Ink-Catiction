import Grid from './grid.js';
import Player from './player.js';
import Powerup from './powerup.js';
import Button from './button.js';

class Game extends Phaser.Scene {
	constructor() {
		super('Game');

		this.saveTime = 0;
		this.isPaused = false;
	}

	init(data) {
		this.player1_character = data.player1;
		this.player2_character = data.player2;

		this.player1_ink = this.getPlayerColor(this.player1_character);
		this.player2_ink = this.getPlayerColor(this.player2_character);

		this.setTimeStart = 1;

		this.over = false;
		this.timer_dropped = false;
	}

	preload() {
		// Placeholders
		this.load.image('cat', '../assets/cat.png');
		this.load.image('box', '../assets/box.png');

		this.load.image('score_box', '../assets/ui/spr_tile_count.png');
		this.load.image('score_box2', '../assets/ui/spr_button_normal.png');

		// Sound
		this.load.audio('bgm', '../assets/audio/mus_match.mp3');
		this.load.audio('end_whisle', '../assets/audio/snd_end.mp3');
		this.load.audio('bomb', '../assets/audio/snd_bomb.mp3');
		this.load.audio('powerup', '../assets/audio/snd_powerup.mp3');
		this.load.audio('hit', '../assets/audio/snd_hit.mp3');

		// UI
		this.load.image('endcard', '../assets/ui/spr_endcard_back.png');
		this.load.image('timer_back', '../assets/ui/spr_timer_back1.png');
		this.load.image('panel', '../assets/ui/spr_button_normal.png');

		this.load.image('end_transition_left', '../assets/ui/spr_end_back_transition_left.png');
		this.load.image('end_transition_center', '../assets/ui/spr_end_back_transition_center.png');
		this.load.image('end_transition_right', '../assets/ui/spr_end_back_transition_right.png');
		this.load.image('end_back_fill', '../assets/ui/spr_end_back_fill.png');

		this.load.image('ink', '../assets/ink_10x.png');
		this.load.image('catacomb_map', '../assets/map_catacombs_base.png');
		this.load.image('catacomb_map_extra', '../assets/map_catacombs_extras.png');
		this.load.image('forest_map', '../assets/map_forest_base.png');
		this.load.image('forest_map_extra', '../assets/map_forest_extras.png');

		// Button sprites
		this.load.image('button_normal', '../assets/ui/spr_button_normal.png');
		this.load.image('button_highlighted', '../assets/ui/spr_button_highlighted.png');
		this.load.image('button_pressed', '../assets/ui/spr_button_pressed.png');
		this.load.image('button_disabled', '../assets/ui/spr_button_disabled.png');

		// Final Sprites
		this.load.spritesheet('agata', '../assets/spritesheets/sprsheet_agata.png', { frameWidth: 22, frameHeight: 22 });
		this.load.spritesheet('frank', '../assets/spritesheets/sprsheet_frankcatstein.png', { frameWidth: 22, frameHeight: 22 });
		this.load.spritesheet('gwynn', '../assets/spritesheets/sprsheet_gwynn.png', { frameWidth: 22, frameHeight: 22 });
		this.load.spritesheet('roach', '../assets/spritesheets/sprsheet_sardinilla.png', { frameWidth: 22, frameHeight: 22 });
		this.load.spritesheet('stregobor', '../assets/spritesheets/sprsheet_stregobor.png', { frameWidth: 22, frameHeight: 22 });
		this.load.spritesheet('yenna', '../assets/spritesheets/sprsheet_yenna.png', { frameWidth: 22, frameHeight: 22 });

		//this.load.spritesheet('hearts', '../assets/hearts-Sheet.png', { frameWidth: 9, frameHeight: 9 });
		this.load.spritesheet('heart_agata', '../assets/spritesheets/spr_heart_agata.png', { frameWidth: 9, frameHeight: 9 });
		this.load.spritesheet('heart_frank', '../assets/spritesheets/spr_heart_frank.png', { frameWidth: 9, frameHeight: 9 });
		this.load.spritesheet('heart_gwynn', '../assets/spritesheets/spr_heart_gwynn.png', { frameWidth: 9, frameHeight: 9 });
		this.load.spritesheet('heart_roach', '../assets/spritesheets/spr_heart_roach.png', { frameWidth: 9, frameHeight: 9 });
		this.load.spritesheet('heart_stregobor', '../assets/spritesheets/spr_heart_stregobor.png', { frameWidth: 9, frameHeight: 9 });
		this.load.spritesheet('heart_yenna', '../assets/spritesheets/spr_heart_yenna.png', { frameWidth: 9, frameHeight: 9 });

		this.load.spritesheet('powerups', '../assets/spritesheets/powerups_spritesheet.png', { frameWidth: 16, frameHeight: 24 });
	}

	create(data) {

		// Map config
		this.bg;
		this.bg_extras;
		this.setMap();

		this.p1ScoreBox = this.add.image(85, 50, 'score_box');
		this.p1ScoreBox.scaleX = 4.0;
		this.p1ScoreBox.scaleY = 3.0;
		this.p1Score = this.add.text(20, 10, '0', { color: '#E5B770', fontSize: '42px', fontFamily: 'Metamorphous', align: 'center' });
		Phaser.Display.Align.In.Center(this.p1Score, this.p1ScoreBox);

		this.p2ScoreBox = this.add.image(1195, 50, 'score_box');
		this.p2ScoreBox.scaleX = 4.0;
		this.p2ScoreBox.scaleY = 3.0;
		this.p2Score = this.add.text(1187, 10, '0', { color: '#E5B770', fontSize: '42px', fontFamily: 'Metamorphous', align: 'center' });
		Phaser.Display.Align.In.Center(this.p2Score, this.p2ScoreBox);

		this.timer_back = this.add.image(640, -100, 'timer_back');
		this.timer_back.scale = 4;
		this.timer_back.depth = 5;

		this.start_timer_back = this.add.nineslice(640, 360, 'panel', undefined, 64, 48, 4, 4, 4, 4, undefined, undefined)
		this.start_timer_back.scale = 4;
		this.start_timer_back.depth = 10;

		// World Configuration
		this.grid = new Grid(this, 'ink', this.p1Score, this.p2Score);

		this.initTime = 0;
		this.gameDuration = 88;
		//this.gameDuration = 14;

		// Player 1 Configuration
		this.keys1 = ["W", "A", "S", "D", "E"]
		this.velocity1 = 200;
		this.player1 = this.physics.add.existing(new Player(this, 128, 215, this.player1_character, 1, this.keys1, this.velocity1, this.player1_ink));
		this.player1.setCollideWorldBounds(true);

		// Player 2 Configuration
		this.keys2 = ["UP", "LEFT", "DOWN", "RIGHT", "M"]
		this.velocity2 = 200;
		this.player2 = this.physics.add.existing(new Player(this, 1152, 215, this.player2_character, 2, this.keys2, this.velocity2, this.player2_ink));
		this.player2.setCollideWorldBounds(true);

		// PowerUps Configuration
		this.powerups = [[200, 100], [200, 200], [200, 300]];
		this.powerup1 = this.physics.add.existing(new Powerup(this, this.powerups[0][0], this.powerups[0][1], 'powerups'));
		this.powerup2 = this.physics.add.existing(new Powerup(this, this.powerups[1][0], this.powerups[1][1], 'powerups'));
		this.powerup3 = this.physics.add.existing(new Powerup(this, this.powerups[2][0], this.powerups[2][1], 'powerups'));

		this.timer = 0;
		this.rounds = 0;

		// Pause menu configuration
		this.pauseButton = new Button(this.onPause, 'II', '64px', this, 1240, 680, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 22, 22);
		this.pauseButton.depth = 10;

		this.startTimeText = this.add.text(300, 50, ' ', { color: '#452600', fontSize: '96px', fontFamily: 'Metamorphous' });
		this.startTimeText.depth = 10;

		this.timeText = this.add.text(0, 0, ' ', { color: '#452600', fontSize: '64px', fontFamily: 'Metamorphous' });
		this.timeText.depth = 10;
		Phaser.Display.Align.In.Center(this.timeText, this.timer_back);

		// End animation setup
		this.end_back_trans_left = this.add.image(213, 360 + 720, 'end_transition_left');
		this.end_back_trans_left.depth = 11;
		this.end_back_trans_center = this.add.image(426 + 213, -360, 'end_transition_center');
		this.end_back_trans_center.depth = 11;
		this.end_back_trans_right = this.add.image(852 + 213, 360 + 720, 'end_transition_right');
		this.end_back_trans_right.depth = 11;
		this.end_back_fill = this.add.image(640, 360, 'end_back_fill');
		this.end_back_fill.depth = 10;
		this.end_back_fill.alpha = 0;

		this.endcard_upper = this.add.image(-922, 1117, 'endcard');
		this.endcard_upper.angle = -28.6;
		this.endcard_upper.depth = 10;

		this.endcard_text_upper = this.add.text(-1015.7, 1140.3, "Game's", { color: '#452600', fontSize: '30pt', fontFamily: 'Metamorphous' });
		this.endcard_text_upper.angle = -28.6;
		this.endcard_text_upper.depth = 10;

		this.endcard_lower = this.add.image(2203, -463, 'endcard');
		this.endcard_lower.angle = -28.6;
		this.endcard_lower.depth = 10;

		this.endcard_text_lower = this.add.text(2193, -481.1, "Over!", { color: '#452600', fontSize: '30pt', fontFamily: 'Metamorphous' });
		this.endcard_text_lower.angle = -28.6;
		this.endcard_text_lower.depth = 10;

		// Audio
		let vol = this.registry.get('volume');
		this.sound.setVolume(vol);

		this.bgm = this.sound.add('bgm');
		this.bgm.play();

		this.endWhisle = this.sound.add('end_whisle');
	}

	// #region Map generation ---------------------------
	setMap(){
		this.randBg = Math.floor(Math.random() * 3 + 1);
		switch(this.randBg){
			case 1:
				// Scary Catacombs
				this.bg = this.add.image(640, 360, 'catacomb_map');
				this.bg.setScale(4);
				this.bg.depth = -10;
				this.bg_extras = this.physics.add.image(640, 360, 'catacomb_map_extra');
				this.bg_extras.setScale(4);
				this.bg_extras.depth = 1;
			break;
			case 2:
				// Fantasy forest
				this.bg = this.add.image(640, 360, 'forest_map');
				this.bg.setScale(4);
				this.bg.depth = -10;
				this.bg_extras = this.physics.add.image(640, 360, 'forest_map_extra');
				this.bg_extras.setScale(4);
				this.bg_extras.depth = 3;
				this.bg_extras.alpha = 0.5;
			break;
			case 3:
				// Placeholder for third map -> Victory Stadium
				this.bg = this.add.image(640, 360, 'forest_map');
				this.bg.setScale(4);
				this.bg.depth = -10;
				this.bg_extras = this.physics.add.image(640, 360, 'forest_map_extra');
				this.bg_extras.setScale(4);
				this.bg_extras.depth = 3;
				this.bg_extras.alpha = 0.5;
			break;
			default: console.log("unable to create map!");

		}
	}

	update(time, delta) {
		if (this.initTime == 0) {
			this.initTime = this.setInitTime(time);
		}
		
		this.timer = (time / 1000) - this.initTime;
		if (this.timer < this.gameDuration) {

			this.countDown(this.timer, this.startTimeText);
			Phaser.Display.Align.In.Center(this.startTimeText, this.start_timer_back);

			// Warmup period
			if (this.timer < 1) {
				this.player1.runAnimation(this.player1, `${this.player1.texture}-teleport`, 0, 0);
				this.player2.runAnimation(this.player2, `${this.player2.texture}-teleport`, 0, 0);
			}
			else if (this.timer > 1 && this.timer < 7) {
				this.player1.runAnimation(this.player1, `${this.player1.texture}-idle`, 0, 0);
				this.player2.runAnimation(this.player2, `${this.player2.texture}-idle`, 0, 0);
			}
			// Game period
			else {
				if (this.isPaused) {
					//this.timeText.setText(this.saveTime);
					//this.timer.setTime();
					//this.timer.resume();
					this.pauseButton.setVisible(true);
					this.isPaused = false;
					this.bgm.resume();
					console.log("Timer: " +this.timer);
					console.log("SaveTime: " +this.saveTime);
				}
				console.log("Timer after if: " +this.timer);

				if (!this.timer_dropped) {
				
					this.timer_dropped = true;
					this.start_timer_back.visible = false;

					this.add.tween({
						targets: this.timer_back,
						duration: 1000,
						y: 40,
						ease: 'Cubic.inOut'
					});
				}

				// Set display timer
				this.timeText.setText(Math.round(this.gameDuration - this.timer + 1));
				Phaser.Display.Align.In.Center(this.timeText, this.timer_back);

				//Update grid
				this.grid.updateGrid(this.player1);
				this.grid.updateGrid(this.player2);

				// Update both players basic movement
				this.player1.updateMovement(this.player1.velocity);
				this.player2.updateMovement(this.player2.velocity);

				let scores = this.grid.countColors();
				this.p1Score.setText(scores[0]);
				Phaser.Display.Align.In.Center(this.p1Score, this.p1ScoreBox);

				this.p2Score.setText(scores[1]);
				Phaser.Display.Align.In.Center(this.p2Score, this.p2ScoreBox);

				// Checks if any player hits the other one while attacking
				this.player1.checkCollission(this.player2, delta);
				this.player2.checkCollission(this.player1, delta);

				// Interactions between Players and Power Ups
				this.powerup1.updatePowerup(this.player1, delta, this.grid);
				this.powerup2.updatePowerup(this.player1, delta, this.grid);
				this.powerup3.updatePowerup(this.player1, delta, this.grid);
				this.powerup1.updatePowerup(this.player2, delta, this.grid);
				this.powerup2.updatePowerup(this.player2, delta, this.grid);
				this.powerup3.updatePowerup(this.player2, delta, this.grid);
			}
			console.clear();
		}
		else if (!this.over) {
			this.over = true;

			this.bgm.stop();
			this.endWhisle.play();

			// Remove timer element
			this.timeText.setText('');
			Phaser.Display.Align.In.Center(this.timeText, this.timer_back);

			this.add.tween({
				targets: this.timer_back,
				duration: 1000,
				y: -100,
				ease: 'Cubic.inOut'
			});

			// Reset players to idle state
			this.player1.resetState();
			this.player2.resetState();

			this.finishGame();
		}
	}

	onPause() {
		this.scene.bgm.pause();
		this.scene.saveTime = this.scene.timeText.text;
		this.scene.isPaused = true;
		this.scene.pauseButton.setVisible(false);

		this.scene.scene.launch("Pause");
		this.scene.scene.pause("Game");
	}

	setInitTime(time) {
		return time / 1000;
	}

	getPlayerColor(character) {
		switch (character) {
			case 'agata':
				return "0xFA27BA";

			case 'frank':
				return "0xFAD927";

			case 'gwynn':
				return "0x27e8fa";

			case 'roach':
				return "0xff9d3b";

			case 'stregobor':
				return "0x2A42C9";

			case 'yenna':
				return "0x5d0aa6";
		}

		return "0xFFFFFF";
	}

	toResults() {
		let scene = this.parent.scene;

		let ranking = scene.grid.countColors();
		console.log(ranking);
		//let p1score = ranking[0];
		//let p2score = ranking[1];
		//console.log('p1 score: ' + p1score);
		//console.log('p2 score: ' + p2score);
		scene.scene.start('Endgame', [ranking, scene.player1.getCharacter(), scene.player2.getCharacter()]);
	}

	countDown(timer, title) {
		if (timer < 5) {
			this.uiTimer(title, 6, 'backwards');
		}
		else if (timer >= 6 && timer < 7) {
			title.setText('GO!');

		}
		else if (timer >= 7) {
			title.visible = false;
		}
	}

	uiTimer(title, start, run) {
		switch (run) {
			case 'forward':
				title.setText(` ${this.timer.toFixed(0)} `);
				break;
			case 'backwards':
				title.setText(` ${start - this.timer.toFixed(0)} `);
				break;
			default:
		}
	}

	// End sequence ------------------------------------
	finishGame() {
		console.log("Game Over");
		this.add.tween({
			targets: this.endcard_upper,
			duration: 1000,
			x: 614,
			y: 280,
			ease: 'Cubic.inOut'
		});

		this.add.tween({
			targets: this.endcard_text_upper,
			duration: 1000,
			x: 520.3,
			y: 303.3,
			ease: 'Cubic.inOut'
		});

		this.add.tween({
			targets: this.endcard_lower,
			duration: 1000,
			x: 665.6,
			y: 374,
			ease: 'Cubic.inOut'
		});

		this.add.tween({
			targets: this.endcard_text_lower,
			duration: 1000,
			x: 655.6,
			y: 355.9,
			ease: 'Cubic.inOut',
			onComplete: this.idleBars
		});
	}

	idleBars() {
		let scene = this.parent.scene;

		// Using a tween as a timer
		scene.add.tween({
			targets: scene.endcard_text_upper,
			duration: 1000,
			x: '+=0',
			onComplete: scene.removeBars
		});
	}

	removeBars() {
		let scene = this.parent.scene;

		scene.add.tween({
			targets: scene.endcard_upper,
			duration: 1000,
			x: 2150,
			y: -557,
			ease: 'Cubic.inOut'
		});

		scene.add.tween({
			targets: scene.endcard_text_upper,
			duration: 1000,
			x: 2056.3,
			y: -533.7,
			ease: 'Cubic.inOut'
		});

		scene.add.tween({
			targets: scene.endcard_lower,
			duration: 1000,
			x: -871.8,
			y: 1211,
			ease: 'Cubic.inOut'
		});

		scene.add.tween({
			targets: scene.endcard_text_lower,
			duration: 1000,
			x: -881.8,
			y: 1192.9,
			ease: 'Cubic.inOut',
			onComplete: scene.backgroundSlide
		});
	}

	backgroundSlide() {
		let scene = this.parent.scene;

		scene.add.tween({
			targets: [scene.end_back_trans_left, scene.end_back_trans_center, scene.end_back_trans_right],
			duration: 1000,
			y: 360,
			ease: 'Cubic.inOut',
			onComplete: scene.fadeCatBackground
		});
	}

	fadeCatBackground() {
		let scene = this.parent.scene;

		scene.add.tween({
			targets: scene.end_back_fill,
			duration: 1000,
			alpha: 1,
			ease: 'Cubic.inOut',
			onComplete: scene.toResults
		});
	}

}

export default Game;
