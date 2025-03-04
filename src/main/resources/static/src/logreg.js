import Button from './button.js';
import TextEntry from './textentry.js';

let registerErrorText;
let loginPasswordErrorText;
let loginErrorText;

class LogReg extends Phaser.Scene
{
	constructor()
	{
		super('LogReg');
	}

	preload()
	{
		// Background UI
			// spr splashes pairing characters
		//this.load.image('splash', '../assets/ui/spr_menu_splash.png');
		this.load.image('splash1', '../assets/ui/spr_menu_splash1.png');
		this.load.image('splash2', '../assets/ui/spr_menu_splash2.png');
		this.load.image('splash3', '../assets/ui/spr_menu_splash3.png');

		this.load.image('back', '../assets/ui/spr_menu_back.png');
		this.load.image('back_char_left', '../assets/ui/spr_menu_char_left.png');
		this.load.image('back_char_right', '../assets/ui/spr_menu_char_right.png');

		this.load.image('throbber', '../assets/ui/spr_throbber.png');
		this.load.image('show', '../assets/ui/spr_show_icon.png');

		// Button sprites
		this.load.image('button_normal', '../assets/ui/spr_button_normal.png');
		this.load.image('button_highlighted', '../assets/ui/spr_button_highlighted.png');
		this.load.image('button_pressed', '../assets/ui/spr_button_pressed.png');
		this.load.image('button_disabled', '../assets/ui/spr_button_disabled.png');
	}

	create() {
		this.registry.set('user', '');
		this.registry.set('online', false);

		const textNormal = {color: '#452600', fontSize: '32px', fontFamily: 'Metamorphous'};
		const textPlaceholder = {color: '#B87F27', fontSize: '32px', fontFamily: 'Metamorphous'};
		const textError = {color: '#A51818', fontSize: '24px', fontFamily: 'Metamorphous'};

		// Background assets
		// this.splash = this.add.image(1000, 360, 'splash');
		this.setsplash();
		this.backgroundSlice = this.add.image(640, 1080-360, 'back');

		// Throbber
		this.throbber = this.add.image(520, 590, 'throbber');
		this.throbber.scale = 3;
		this.throbber.depth = 10;
		this.throbber.visible = false;

		this.throbber_shadow = this.add.image(524, 594, 'throbber');
		this.throbber_shadow.scale = 3;
		this.throbber_shadow.depth = 9;
		this.throbber_shadow.setTint("0x301100");
		this.throbber_shadow.visible = false;

		this.throbber_rotation = 0;

		// Game Title -----------------------------------
		this.title1 = this.add.text(50, 50, 'Ink', {color: '#E5B770', fontSize: '96px', fontFamily: 'Metamorphous'});
		this.title2 = this.add.text(50, 126, 'Catiction', {color: '#E5B770', fontSize: '96px', fontFamily: 'Metamorphous'});

		this.logInButton = new Button(this.onLogIn, 'Log in', '32px', this, 140, 270, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 60, 20);
		this.logInButton.toggleEnable();
		this.mode = 'log';

		this.usernameText = this.add.text(50, 315, 'Username:', {color: '#E5B770', fontSize: '20px', fontFamily: 'Metamorphous'});
		//this.usernameBox = this.add.nineslice(50, 350, 'button_normal', undefined, 140, 25, 4, 4, 4, 4, undefined, undefined).setOrigin(0,0);
		//this.usernameBox.scale = 3;
		this.usernameBox = new TextEntry(this, 260, 390, 140, 25, 'button_normal', 'button_highlighted', "Enter a name...", textNormal, textPlaceholder);

		this.passwordText = this.add.text(50, 435, 'Password:', {color: '#E5B770', fontSize: '20px', fontFamily: 'Metamorphous'});
		//this.passwordBox = this.add.nineslice(50, 470, 'button_normal', undefined, 140, 25, 4, 4, 4, 4, undefined, undefined).setOrigin(0,0);
		//this.passwordBox.scale = 3;
		this.passwordBox = new TextEntry(this, 260, 510, 140, 25, 'button_normal', 'button_highlighted', "Enter a password...", textNormal, textPlaceholder, true);
		this.showPassword = new Button(this.onTogglePassword, "", '1px', this, 520, 510, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 25, 25)
		this.showIcon = this.add.image(520, 510, 'show');
		this.showIcon.scale = 3;

		this.registerButton = new Button(this.onRegister, 'Register', '32px', this, 380, 270, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 60, 20);
		this.confirmButton = new Button(this.onConfirm, 'Confirm', '32px', this, 260, 590, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 140, 20);
		this.offlineButton = new Button(this.onStartOffline, 'Offline mode', '32px', this, 260, 660, 'button_normal', 'button_highlighted', 'button_pressed', 'button_disabled', 140, 20);
		
		registerErrorText = this.add.text(480, 640, "User already exists!", textError);
		registerErrorText.visible = false;

		loginPasswordErrorText = this.add.text(480, 640, "Wrong password!", textError);
		loginPasswordErrorText.visible = false;

		loginErrorText = this.add.text(480, 640, "User does not exist!", textError);
		loginErrorText.visible = false;

		this.input.on('pointerdown', function (pointer)
        {
			this.usernameBox.checkForSelection();
			this.passwordBox.checkForSelection();

        }, this);
	}

	update(time, delta)
	{
		this.throbber_rotation += 0.005 * delta;
		if(this.throbber_rotation > 2 * 3.1415) this.throbber_rotation -= 2 * 3.1415;

		this.throbber.setRotation(this.throbber_rotation);
		this.throbber_shadow.setRotation(this.throbber_rotation);
	}

	onTogglePassword()
	{
		this.scene.passwordBox.togglePassword();
	}

	onStartOffline()
	{
		this.scene.offlineButton.toggleEnable();
		this.scene.registry.set('user', '');
		this.scene.registry.set('online', false);
		this.scene.registry.set('volume', 1);
		this.scene.scene.start('Menu');
	}

	onRegister() {
		this.scene.registerButton.toggleEnable();
		this.scene.logInButton.toggleEnable();
		this.scene.mode = 'reg';
	}

	onLogIn() {
		this.scene.registerButton.toggleEnable();
		this.scene.logInButton.toggleEnable();
		this.scene.mode = 'log';
	}

	onConfirm()
	{
		const baseUrl = '/api/users/';

		let username = this.scene.usernameBox.submitText();
		let password = this.scene.passwordBox.submitText();

		let getUrl = baseUrl + username;
		let registerUrl = baseUrl + "register";
		let loginUrl = baseUrl + "login";
		let scene = this.scene;

		scene.confirmButton.toggleEnable();
		registerErrorText.visible = false;
		loginErrorText.visible = false;
		loginPasswordErrorText.visible = false;

		if(this.scene.mode == 'reg')
		{
			scene.throbber_rotation = 0;
			scene.throbber.visible = true;
			scene.throbber_shadow.visible = true;

			$.get(getUrl, function (data) {}).done(function()
			{
				registerErrorText.visible = true;
				scene.throbber.visible = false;
				scene.throbber_shadow.visible = false;

			}).fail(function(){
				
				$.ajax({
					contentType: 'application/json',
					data: JSON.stringify({username:username, password:password, volume:1.0}),
					dataType: 'json',
					processData: false,
					type: 'POST',
					url: registerUrl
				}).done(function(){

					scene.registry.set('user', username);
					scene.registry.set('online', true);
					scene.registry.set('volume', 1);
					scene.scene.start('Menu');
				}).fail(function(){
					
					scene.confirmButton.toggleEnable();
					scene.throbber.visible = false;
					scene.throbber_shadow.visible = false;
				});
			});
		}
		else if(this.scene.mode == 'log')
		{
			scene.throbber_rotation = 0;
			scene.throbber.visible = true;
			scene.throbber_shadow.visible = true;

			$.ajax({
				contentType: 'application/json',
				data: JSON.stringify({username:username, password:password, volume:1.0}),
				dataType: 'json',
				processData: false,
				type: 'POST',
				url: loginUrl
			}).done(function(data){

				console.log("Logged into user: " + data.username);
				scene.registry.set('user', data.username);
				scene.registry.set('volume', data.volume);
				scene.registry.set('online', true);
				scene.scene.start('Menu');
			}).fail(function(jqXHR, textStatus){

				if(jqXHR.status == 400)
				{
					loginPasswordErrorText.visible = true;
				}
				else
				{
					loginErrorText.visible = true;
				}
				
				scene.confirmButton.toggleEnable();
				scene.throbber.visible = false;
				scene.throbber_shadow.visible = false;
			});
		}
	}

	setsplash(){
		this.randSplash = Math.floor(Math.random() * 3 + 1);
		this.splash = this.add.image(1000, 360, `splash${this.randSplash}`);
	}
}
export default LogReg;