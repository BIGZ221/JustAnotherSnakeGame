use console_engine::{rect_style::BorderStyle, Color, ConsoleEngine, KeyCode};
mod snake;
use snake::{Direction, Snake};

fn main() {
    let mut engine = ConsoleEngine::init_fill_require(25, 30, 4).unwrap();

    let mut snake = Snake::new(20, 20);
    loop {
        engine.wait_frame(); // wait for next frame + capture inputs
        engine.clear_screen(); // reset the screen
        engine.rect_border(
            0,
            0,
            21,
            21,
            BorderStyle::new_solid().with_colors(Color::DarkGrey, Color::Black),
        );
        print_instructions(&mut engine, 23);
        if engine.is_key_pressed(KeyCode::Char('r')) {
            snake = Snake::new(20, 20);
        }
        if engine.is_key_pressed(KeyCode::Char('w')) || engine.is_key_pressed(KeyCode::Up) {
            snake.change_dir(Direction::Up);
        }
        if engine.is_key_pressed(KeyCode::Char('d')) || engine.is_key_pressed(KeyCode::Right) {
            snake.change_dir(Direction::Right);
        }
        if engine.is_key_pressed(KeyCode::Char('s')) || engine.is_key_pressed(KeyCode::Down) {
            snake.change_dir(Direction::Down);
        }
        if engine.is_key_pressed(KeyCode::Char('a')) || engine.is_key_pressed(KeyCode::Left) {
            snake.change_dir(Direction::Left);
        }
        snake.move_forward();
        snake.draw(&mut engine, 1, 1);
        engine.print(0, 22, format!("Score: {}", snake.get_score()).as_str());
        if engine.is_key_pressed(KeyCode::Char('q')) || engine.is_key_pressed(KeyCode::Esc) {
            break;
        }
        engine.draw();
    }
}

fn print_instructions(engine: &mut ConsoleEngine, y: i32) {
    engine.print(0, y + 0, format!("Quit:    {}", "esc, q").as_str());
    engine.print(0, y + 1, format!("Restart: {}", "r").as_str());
    engine.print(0, y + 2, format!("Up:      {}", "^, w").as_str());
    engine.print(0, y + 3, format!("Right:   {}", ">, d").as_str());
    engine.print(0, y + 4, format!("Down:    {}", "v, s").as_str());
    engine.print(0, y + 5, format!("Left:    {}", "<, a").as_str());
}
