const lab = document.querySelector('.decision-lab');
const quiz = lab.querySelector('.quiz');
const rounds = [...lab.querySelectorAll('fieldset')];
const options = rounds.map(round => round.querySelector('details strong').textContent.slice(0, -1));
let index = 0;
let score = 0;

function showRound(focus = true) {
  const round = rounds[index];
  quiz.innerHTML = '<p class="kicker">Question ' + (index + 1) + ' of ' + rounds.length +
    '</p><h3 tabindex="-1"></h3><p class="scenario"></p><div class="quiz-options"></div><div class="quiz-feedback"></div>';
  const heading = quiz.querySelector('h3');
  heading.textContent = round.querySelector('legend').textContent.replace(/^\d+\. /, '');
  quiz.querySelector('.scenario').textContent = round.querySelector('p').textContent;
  for (const option of options) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option;
    button.addEventListener('click', () => {
      const correct = option === options[index];
      score += Number(correct);
      button.classList.add(correct ? 'correct' : 'incorrect');
      quiz.querySelectorAll('.quiz-options button').forEach(tile => { tile.disabled = true; });
      showFeedback(correct, round);
    });
    quiz.querySelector('.quiz-options').append(button);
  }
  if (focus) heading.focus();
}

function showFeedback(correct, round) {
  const panel = document.createElement('dialog');
  panel.className = 'quiz-overlay';
  panel.setAttribute('aria-labelledby', 'quiz-verdict');
  panel.innerHTML = '<p class="kicker">The recommendation</p><h3 id="quiz-verdict" tabindex="-1"></h3><p class="quiz-reason"></p><p class="quiz-timing"></p><div class="quiz-actions"><button type="button" class="quiz-next">Pause</button><button type="button" class="quiz-next"></button></div>';
  panel.querySelector('h3').textContent = correct ? 'You got it!' : 'A different approach fits better';
  panel.querySelector('.quiz-reason').textContent = round.querySelector('details p').textContent;
  const timing = panel.querySelector('.quiz-timing');
  const [pause, next] = panel.querySelectorAll('button');
  const last = index + 1 === rounds.length;
  next.textContent = last ? 'See results now' : 'Continue now';
  let timer;
  function advance() {
    clearTimeout(timer);
    panel.close();
    panel.remove();
    index += 1;
    if (last) showResults();
    else showRound();
  }
  function startTimer() {
    timing.textContent = last ? 'Results in 12 seconds.' : 'Next question in 12 seconds.';
    pause.textContent = 'Pause';
    timer = setTimeout(advance, 12000);
  }
  pause.onclick = () => {
    if (timer === undefined) {
      startTimer();
    } else {
      clearTimeout(timer);
      timer = undefined;
      timing.textContent = 'Paused. Take your time.';
      pause.textContent = 'Resume';
    }
  };
  next.onclick = advance;
  panel.addEventListener('cancel', event => { event.preventDefault(); advance(); });
  quiz.append(panel);
  panel.showModal();
  panel.querySelector('h3').focus();
  startTimer();
}

function showResults() {
  quiz.innerHTML = `<p class="kicker">Challenge complete</p><h3 tabindex="-1">${score} of ${rounds.length} matched my recommendations</h3>
  <svg class="quiz-map" viewBox="0 0 400 355" role="img" aria-label="AI contains machine learning, which includes generative AI. A generative AI agent is shown inside generative AI. Rules-based automation sits outside.">
  <circle cx="200" cy="155" r="149" fill="#e2e9d7"/><circle cx="200" cy="175" r="116" fill="#cbdcc1"/>
  <circle cx="200" cy="194" r="83" fill="#a8c3a5"/><circle cx="200" cy="214" r="50" fill="#24463b"/>
  <g text-anchor="middle" fill="#132c26" font-size="15" font-weight="700"><text x="200" y="39">AI</text><text x="200" y="90">Machine learning</text><text x="200" y="143">Generative AI</text><text x="200" y="210" fill="white">GenAI</text><text x="200" y="230" fill="white">agent</text><text x="200" y="338">Rules-based automation sits outside</text></g></svg>
  <p>The inner circle shows one kind of agent that uses GenAI. Agency describes how a system chooses steps and uses tools. Agents can also use other approaches.</p>
  <button type="button" class="quiz-next">Play again</button>`;
  quiz.querySelector('button').onclick = () => { index = 0; score = 0; showRound(); };
  quiz.querySelector('h3').focus();
}

showRound(false);
rounds.forEach(round => { round.hidden = true; });
quiz.hidden = false;
