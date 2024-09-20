export function checkControllers ({mario, keys}) {
    const isMarioTouchingFloor = mario.body.touching.down

    const isLeftKeyDown = keys.left.isDown
    const isRightKeyDown = keys.right.isDown
    const isUpKeyDown = keys.up.isDown
    
    if(mario.isDead) return
    
    if(isLeftKeyDown)
    {
        isMarioTouchingFloor && mario.anims.play('mario-walk', true)
        mario.setVelocityX(-100)
        mario.flipX = true
    }
    else if(isRightKeyDown)
    {
        isMarioTouchingFloor && mario.anims.play('mario-walk', true)
        mario.x += 1
        mario.flipX = false
    }
    else if(isMarioTouchingFloor){
        isMarioTouchingFloor && mario.anims.play('mario-stop', true)
        mario.setVelocityX(0)
    }

    if(isUpKeyDown && isMarioTouchingFloor)
    {
        mario.setVelocityY(-300)
        mario.anims.play('mario-jump', true)
        //sound.add('soundJump',{ volume: 0.2}).play() 
    }
}