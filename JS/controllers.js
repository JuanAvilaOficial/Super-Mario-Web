const MARIO_ANIMATIONS = {
    grown :{
        stop: 'mario-grown-stop',
        walk: 'mario-grown-walk',
        jump: 'mario-grown-jump'
    },
    normal: {
        stop: 'mario-stop',
        walk: 'mario-walk',
        jump: 'mario-jump'
    }
}

export function checkControllers ({mario, keys}) {
    const isMarioTouchingFloor = mario.body.touching.down

    const isLeftKeyDown = keys.left.isDown
    const isRightKeyDown = keys.right.isDown
    const isUpKeyDown = keys.up.isDown
    
    if(mario.isDead) return

    const marioAnimations = mario.isGrown ? MARIO_ANIMATIONS.grown:
    MARIO_ANIMATIONS.normal
    
    if(isLeftKeyDown)
    {
        isMarioTouchingFloor && mario.anims.play(marioAnimations.walk, true)
        mario.setVelocityX(-100)
        mario.flipX = true
    }
    else if(isRightKeyDown)
    {
        isMarioTouchingFloor && mario.anims.play(marioAnimations.walk, true)
        mario.x += 1
        mario.flipX = false
    }
    else if(isMarioTouchingFloor){
        isMarioTouchingFloor && mario.anims.play(marioAnimations.stop, true)
        mario.setVelocityX(0)
    }

    if(isUpKeyDown && isMarioTouchingFloor)
    {
        mario.setVelocityY(-300)
        mario.anims.play(marioAnimations.jump, true)
        //sound.add('soundJump',{ volume: 0.2}).play() 
    }
}