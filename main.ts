input.onButtonPressed(Button.A, function () {
    DualChannelFullHMovement.Move(movementController, DualChannelFullHMovement.MoveDirection.Forward, 512)
})
input.onButtonPressed(Button.B, function () {
    DualChannelFullHMovement.Move(movementController, DualChannelFullHMovement.MoveDirection.Backward, 512)
})
let movementController: DualChannelFullHMovement.MotorController = null
movementController = DualChannelFullHMovement.SetupMotorController(
AnalogPin.P1,
AnalogPin.P9,
AnalogPin.P10,
AnalogPin.P15
)
