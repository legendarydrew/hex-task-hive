/**
 * A component representing a task as a "rune token".
 * The colour of the token (background or text?) will be determined by the task list's palette.
 */

import './RuneToken.scss';

function RuneToken(props) {
  return (
    <button type="button" className="rune-token">        
      <span className="rune-token-number">{props.taskId}</span>
    </button>
  );
}

export default RuneToken;
