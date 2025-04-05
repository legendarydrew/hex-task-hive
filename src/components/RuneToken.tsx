/**
 * A component representing a task as a "rune token".
 * The colour of the token (background or text?) will be determined by the task list's palette.
 */

import "./RuneToken.scss";

export default function RuneToken(props) {
  function clickHandler() {
    props.onClick && props.onClick(props.task);
  }

  return (
    <button type="button" className="rune-token" onClick={clickHandler}>
      <span className="rune-token-number">{props.taskId}</span>
    </button>
  );
}
