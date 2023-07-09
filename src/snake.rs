use console_engine::{
    pixel::{pxl_bg, pxl_fg},
    Color, ConsoleEngine,
};
use rand::{rngs::ThreadRng, Rng};
use ritelinked::LinkedHashSet;

#[derive(Hash, PartialEq, Eq, Debug, Clone)]
struct Vec2 {
    x: i32,
    y: i32,
}

impl Vec2 {
    pub fn add(&mut self, rhs: &Vec2) {
        self.x += rhs.x;
        self.y += rhs.y;
    }
}

pub enum Direction {
    Up,
    Down,
    Right,
    Left,
}

#[derive(Debug)]
pub struct Snake {
    alive: bool,
    score: u32,
    body: LinkedHashSet<Vec2>,
    world: LinkedHashSet<Vec2>,
    food: Vec2,
    rng: ThreadRng,
    dir: Vec2,
    max_x: i32,
    max_y: i32,
}

impl Snake {
    pub fn new(max_x: i32, max_y: i32) -> Snake {
        let mut body: LinkedHashSet<Vec2> = LinkedHashSet::new();
        let start = Vec2 {
            x: max_x / 2,
            y: max_y / 2,
        };
        body.insert(start.clone());
        let mut world: LinkedHashSet<Vec2> = LinkedHashSet::new();
        for x in 0..max_x {
            for y in 0..max_y {
                world.insert(Vec2 { x, y });
            }
        }
        Snake {
            body,
            world,
            max_x,
            max_y,
            food: Vec2 {
                x: 13 % max_x,
                y: 15 % max_y,
            },
            rng: rand::thread_rng(),
            dir: Vec2 { x: 0, y: -1 },
            score: 1,
            alive: true,
        }
    }

    pub fn draw(&self, engine: &mut ConsoleEngine, x_offset: i32, y_offset: i32) {
        for el in &self.world {
            engine.set_pxl(el.x + x_offset, el.y + y_offset, pxl_bg('#', Color::Black));
        }
        for el in &self.body {
            engine.set_pxl(el.x + x_offset, el.y + y_offset, pxl_fg('O', Color::Red));
        }
        engine.set_pxl(
            self.food.x + x_offset,
            self.food.y + y_offset,
            pxl_fg('Q', Color::Green),
        );
    }

    pub fn move_forward(&mut self) {
        if !self.alive || self.will_die() {
            self.alive = false;
            return;
        }
        let mut head = self.body.front().unwrap().clone();
        head.add(&self.dir);
        self.body.insert(head.clone());
        self.body.to_front(&head);
        if !self.body.contains(&self.food) {
            self.body.pop_back();
        } else {
            self.score += 1;
            self.spawn_food();
        }
    }

    pub fn change_dir(&mut self, dir: Direction) {
        self.dir = match dir {
            Direction::Up => Vec2 { x: 0, y: -1 },
            Direction::Down => Vec2 { x: 0, y: 1 },
            Direction::Right => Vec2 { x: 1, y: 0 },
            Direction::Left => Vec2 { x: -1, y: 0 },
        }
    }

    pub fn get_score(&self) -> u32 {
        self.score
    }

    fn will_die(&self) -> bool {
        let mut head = self.body.front().unwrap().clone();
        head.add(&self.dir);
        head.x < 0
            || head.x >= self.max_x
            || head.y < 0
            || head.y >= self.max_y
            || self.body.contains(&head)
    }

    fn spawn_food(&mut self) {
        let possible_positions: Vec<&Vec2> = self.world.difference(&self.body).collect();
        let i: usize = self.rng.gen();
        self.food = possible_positions[i % possible_positions.len()].clone();
    }
}
