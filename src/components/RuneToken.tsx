/**
 * A component representing a task as a "rune token".
 * The colour of the token (background or text?) will be determined by the task list's palette.
 */

import "./RuneToken.scss";

export default function RuneToken(props) {
  function clickHandler() {
    props.onClick && props.onClick(props.task);
  }

  function wasPicked(): boolean {
    return !!props.task.pickedAt;
  }

  function isComplete(): boolean {
    return !!props.task.completedAt;
  }

  function runeClasses(): string {
    const classes = ['rune-token'];
    if (isComplete()) {
      classes.push('complete');
    } else if (wasPicked()) {
      classes.push('picked');
    }
    return classes.join(' ');
  }

  return (
    <button type="button" className={runeClasses()} onClick={clickHandler}>
      <span className="rune-token-number">{props.taskId}</span>
    </button>
  );
}
