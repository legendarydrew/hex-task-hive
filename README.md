# hex-task-hive

![experience with React](https://img.shields.io/badge/experience-react-blue.svg?style=flat)
![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)

A to-do list with a difference, inspired by my "99 Projects" campaign for 2025.

Tasks are represented by numeric "rune tokens", and a task can be chosen at random. Each task can also be marked as complete as progress is made. 

This project was originally created using [Lovable](https://lovable.dev), but refined by me - because AI should be used as a tool, not a weapon.

## What technologies are used for this project?

Lovable built this project with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS (although I asked for Bootstrap!).

## Purposes of the project

- Building a tool I would find extremely useful, for motivation to complete smaller tasks/projects.
- Demonstrating the ability to prompt Lovable to create an app.
- Demonstrating the ability to modify the functionality of an AI-generated app, instead of using it as-is (and pretending I did the work).
- Demonstrating the ability to work with a React app.
- [reluctantly] Working with Tailwind CSS. (I *really* don't understand why it has become so popular, outside of perhaps developing generic/admin interfaces.)
- Hopefully useful toward overcoming the age-old hurdle of not having enough "experience" to gain "experience".

## Objectives of the project
- Ability to manage multiple lists of tasks (e.g. for different projects).
- Tasks are represented as a hexagonal grid, with each task represented by a hexagonal token.
- Tasks can be easily created, updated and removed.
- The list of tasks can be shuffled, *provided* the tasks have not been completed or picked yet.
- Lists of tasks can have configurable categories.
- An incomplete task can be picked at random.
- Tasks can be marked as complete, with the date of completion.
- Tasks can be categorised.
- A progress bar displays the ratio of completed tasks.

## Bonus tasks
- [Function] Perhaps display a line chart on said dialog.
- [Function] Export information as text.
- [Function] Ability to edit task lists (including categories).
- [Function] Display the task description when hovering over a rune token.
- [Style] Use the Cooper Hewitt fount for the rune tokens.
- [Style] Change the colour of rune tokens based on the associated task's category.
- [Style] Watch out for colour contrasts.
- [Style] Add a favicon!
