
import { createAnimation } from "./animaciones.js"
import { initAudio, playAudio } from "./audio.js"
import { checkControllers } from "./controllers.js"
import { initSpriteSheet } from "./spritesheet.js"

const config = {
    autoFocus: false,
    type: Phaser.AUTO,
    width: 256,
    height: 244,
    backgroundColor: '#049cd8',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade:{
            gravity: {y: 300},
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
}

new Phaser.Game(config)

function preload () 
{
    this.load.image(
        'cloud1',
        'assets/scenery/overworld/cloud1.png'
    )
    
    this.load.image(
        'floorbricks',
        'assets/scenery/overworld/floorbricks.png'
    )
    
    initSpriteSheet(this)
    initAudio(this)    
}

function create (){
    createAnimation(this)

    this.add.image(100, 50, 'cloud1')
        .setOrigin(0 , 0)
        .setScale(0.15)

    this.floor =  this.physics.add.staticGroup()        
    this.floor.create(0, config.height - 16, 'floorbricks')
        .setOrigin(0, 0.5)
        .refreshBody()
    this.floor.create(150, config.height - 16, 'floorbricks')
        .setOrigin(0, 0.5)
        .refreshBody()
    
    this.mario = this.physics.add.sprite(50, 100, 'mario')
        .setOrigin(0, 1)
        .setCollideWorldBounds(true)
        .setGravityY(300)
    
    this.enemy = this.physics.add.sprite(120, config.height - 30, 'goomba')
        .setOrigin(0, 1)
        .setGravityY(300)
        .setVelocityX(-50)
    this.enemy.anims.play('goomba-walk', true)

    this.coins = this.physics.add.staticGroup() 
    this.coins.create(150,150, 'coin').anims.play('coin-idle', true)
    this.coins.create(300,150, 'coin').anims.play('coin-idle', true)

    this.physics.add.overlap(this.mario, this.coins, collectCoin, null, this)
    
    this.physics.world.setBounds(0, 0, 2000, config.height)
    this.physics.add.collider(this.mario, this.floor)
    this.physics.add.collider(this.enemy, this.floor)
    this.physics.add.collider(this.mario, this.enemy,
        onHitEnemy, null, this)    

    this.cameras.main.setBounds(0, 0, 2000, config.height)
    this.cameras.main.startFollow(this.mario)   
   
    this.keys = this.input.keyboard.createCursorKeys()
}


function collectCoin(mario, coin){
    playAudio('coin-pickup', this, { volume: 0.2})
    coin.destroy()
    addToScore(100, coin, this)    
}

function addToScore(scoreToAdd, origin, game){
    const scoreText = game.add.text(
        origin.x,
        origin.y,
        scoreToAdd,
        {
            fontFamily: 'pixel',
            fontSize: config.width/40
        }
    )
    game.tweens.add({
        targets: scoreText,
        duration: 500,
        y: scoreText.y - 20,
        onComplete: () => {
            scoreText.destroy()
        }
    })
}

function onHitEnemy(mario, enemy){
    if(mario.body.touching.down && enemy.body.touching.up){
        enemy.anims.play('goomba-hurt',true)
        enemy.setVelocityX(0)
        mario.setVelocityY(-200)

        playAudio('goomba-stomp', this)
        addToScore(200, enemy, this)

        setTimeout(() => {
            enemy.destroy()
        }, 500)
    }else
        killMario(this)
}

function update () 
{    
    const { mario } = this
    checkControllers(this)

    if(mario.y >= config.height){
        killMario(this)       
    }    
}
function killMario (game) {
    const { mario, scene } = game

    if (mario.isDead) return

    mario.isDead = true
    mario.anims.play('mario-dead')       
    mario.setCollideWorldBounds(false)

    //playAudio('gameover', game, { volume: 0.2 })

    mario.body.checkCollision.none = true
    mario.setVelocityX(0)
   

    setTimeout(()=> {
        mario.setVelocityY(-200)
        
    }, 100)

    setTimeout(() => {
        scene.restart()
    }, 2000)
}
