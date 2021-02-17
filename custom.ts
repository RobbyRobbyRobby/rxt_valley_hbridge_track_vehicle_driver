/**
 * Movement a SN754410 in a dual-drive (tank like) mode with PWM.
 */
//% weight=100 color=#8A2BE2 icon=""
namespace DualChannelFullHMovement 
{

    export class MotorController 
    {
        _leftForward: AnalogPin;
        _leftBackward: AnalogPin;
        _rightForward: AnalogPin;
        _rightBackward: AnalogPin;
        _defaultPower: number;

        constructor (
            leftChanForwardPin: AnalogPin, 
            leftChanBackwardPin: AnalogPin, 
            rightChanForwardPin: AnalogPin, 
            rightChanBackwardPin: AnalogPin)
        {
            this._leftForward = leftChanForwardPin;
            this._leftBackward = leftChanBackwardPin;
            this._rightForward = rightChanForwardPin;
            this._rightBackward = rightChanBackwardPin;

            this._defaultPower = 522;

            pins.analogSetPeriod(this._leftForward,20000);
            pins.analogSetPeriod(this._leftBackward,20000);
            pins.analogSetPeriod(this._rightForward,20000);
            pins.analogSetPeriod(this._rightBackward,20000);
        }

        get DefaultPower () 
        {
            return this._defaultPower;
        }
    }
    
    /**
    * Each Motor Controller represents a dual full H bridge chip.
    * This means analog control forwards and backwards on each of two channels (left and right)
    * Configure the pins used; one for each left forward, left backward, right forward, right backward.
    */
    //% block="New Motor Controller Left Fwd pin = $leftChanPinA Left Bck pin = %leftChanPinB Right Fwd pin = $rightChanPinA Right Bck pin = $rightChanPinB"
    //% @param leftChanForwardPin = Left Forward
    //% @param leftChanBackwardPin = Left Backward
    //% @param rightChanForwardPin = Right Forward
    //% @param rightChanBackwardPin = Right Backward
    //% blockSetVariable=movementController
    //% leftChanForwardPin.defl=AnalogPin.P1
    //% leftChanBackwardPin.defl=AnalogPin.P2
    //% rightChanForwardPin.defl=AnalogPin.P3
    //% rightChanBackwardPin.defl=AnalogPin.P4
    export function SetupMotorController(
        leftChanForwardPin: AnalogPin, 
        leftChanBackwardPin: AnalogPin, 
        rightChanForwardPin: AnalogPin, 
        rightChanBackwardPin: AnalogPin) : MotorController
    {
        return new MotorController(
            leftChanForwardPin, 
            leftChanBackwardPin, 
            rightChanForwardPin, 
            rightChanBackwardPin);
    }

    export enum TurnDirection 
    {
        //% block="Left"
        Left,
        //% block="Right"
        Right
    }

    export enum MoveDirection 
    {
        //% block="Forward"
        Forward,
        //% block="Backward"
        Backward
    }
    
    export enum MotorChannelSelection
    {
        //% block="Both"
        Both,
        //% block="Left"
        Left,
        //% block="Right"
        Right
    }
        
    /**
    * Set the default power for all actions
    */
    //% block="Set Default Power for $controller to $power"
    //% power.min=0 power.max=1023 power.defl=522
    export function SetDefaultPower(controller: MotorController, power: number=512)
    {
        if (power != null &&
            power >= 0 &&
            power <= 1023)
        {
            controller._defaultPower = power;
        }
    }
        
    /**
    * Get the default power for all actions
    */
    //% block="Get Default Power for $controller"
    export function GetDefaultPower(controller: MotorController) : number
    {
        return controller._defaultPower;
    }

    /** 
    * Turns the requested direction, at specified power (0-1023).
    * Defaults to using both left and right motor channels to turn.
    * If power set to 0, the default will be used.
    */     
    //% @param direction - The direction to turn
    //% @param motors - Which motor channel to use for turn 
    //% @param power - Power, or speed, to use in turn  
    //% power.min=0 power.max=1023
    //% blockId=turnVehicle 
    //% block="on $controller Turn $direction using $motors channel(s) with power $power"
    //% expandableArgumentMode="toggle" 
    export function Turn(
        controller: MotorController, 
        direction: TurnDirection, 
        motors: MotorChannelSelection, 
        power: number): void 
    {

        if (power == null || power == 0)
        {
            power = controller.DefaultPower;
        }

        switch (direction)
        {
            case TurnDirection.Left:
            {
                switch (motors)
                {
                    case MotorChannelSelection.Left:
                    {
                        pins.analogWritePin(controller._leftForward, 0); 
                        pins.analogWritePin(controller._leftBackward, power); 
                        pins.analogWritePin(controller._rightForward, 0); 
                        pins.analogWritePin(controller._rightBackward, 0);                            
                    }
                    case MotorChannelSelection.Right:
                    {
                        pins.analogWritePin(controller._leftForward, 0); 
                        pins.analogWritePin(controller._leftBackward, 0); 
                        pins.analogWritePin(controller._rightForward, power); 
                        pins.analogWritePin(controller._rightBackward, 0); 
                    }
                    case MotorChannelSelection.Both:
                    {
                        pins.analogWritePin(controller._leftForward, 0); 
                        pins.analogWritePin(controller._leftBackward, power); 
                        pins.analogWritePin(controller._rightForward, power); 
                        pins.analogWritePin(controller._rightBackward, 0);
                    }
                }
            }
            case TurnDirection.Right:
            {
                switch (motors)
                {
                    case MotorChannelSelection.Left:
                    {
                        pins.analogWritePin(controller._leftForward, power); 
                        pins.analogWritePin(controller._leftBackward, 0); 
                        pins.analogWritePin(controller._rightForward, 0); 
                        pins.analogWritePin(controller._rightBackward, 0);
                    }
                    case MotorChannelSelection.Right:
                    {
                        pins.analogWritePin(controller._leftForward, 0); 
                        pins.analogWritePin(controller._leftBackward, 0); 
                        pins.analogWritePin(controller._rightForward, 0); 
                        pins.analogWritePin(controller._rightBackward, power);
                    }
                    case MotorChannelSelection.Both:
                    {
                        pins.analogWritePin(controller._leftForward, power); 
                        pins.analogWritePin(controller._leftBackward, 0); 
                        pins.analogWritePin(controller._rightForward, 0); 
                        pins.analogWritePin(controller._rightBackward, power);
                    }
                }
            }
        }
    }    

    /** 
    * Drives the requested direction, at specified power (0-1023).
    * If power set to 0, the default will be used.
    */     
    //% @param direction - The direction to move
    //% @param power - Power, or speed, to use in turn
    //% power.min=0 power.max=1023
    //% blockId=driveVehicle 
    //% block="on $controller Drive $direction with power $power"
    //% expandableArgumentMode="toggle" 
    export function Move(
        controller: MotorController, 
        direction: MoveDirection, 
        power: number): void 
    {
            
        if (power == null || power == 0)
        {
            power = controller.DefaultPower;
        }
            
        switch (direction)
        {
            case MoveDirection.Forward:
            {
                pins.analogWritePin(controller._leftForward, power); 
                pins.analogWritePin(controller._leftBackward, 0); 
                pins.analogWritePin(controller._rightForward, power); 
                pins.analogWritePin(controller._rightBackward, 0);
            }
            case MoveDirection.Backward:
            {
                pins.analogWritePin(controller._leftForward, 0); 
                pins.analogWritePin(controller._leftBackward, power); 
                pins.analogWritePin(controller._rightForward, 0); 
                pins.analogWritePin(controller._rightBackward, power);
            }
        }
    }

    /** 
    * Locks the motor to prevent it from moving or free-wheeling.
    * Defaults to using both left and right motors.
    */     
    //% @param motors - Which motor channel to break   
    //% blockId=handBreak 
    //% block="on $controller Handbreak on $motors channel(s)" 
    export function Handbreak(
        controller: MotorController, 
        motors: MotorChannelSelection): void 
    {
        switch (motors)
        {
            case MotorChannelSelection.Left:
            {

            }
            case MotorChannelSelection.Right:
            {

            }
            case MotorChannelSelection.Both:
            {

            }
        }
    }

    /** 
    * Ceases powering both motor channels.
    * Leaves motors in an unlocked 'free-wheeling' state.
    */       
    //% blockId=fullStop 
    //% block="on $controller Stop motor power on both channels" 
    export function FullStop(controller: MotorController): void 
    {
        pins.analogWritePin(controller._leftForward, 1); 
        pins.analogWritePin(controller._leftBackward, 1); 
        pins.analogWritePin(controller._rightForward, 0); 
        pins.analogWritePin(controller._rightBackward, 0);
    }
}

