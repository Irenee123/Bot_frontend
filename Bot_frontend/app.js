// ...existing code...
// Lightweight frontend chat logic and dataset

const QUESTIONS = [
  {
    q: "What is a normal menstrual cycle length?",
    a: "A normal menstrual cycle typically ranges from 21 to 35 days, with the average cycle lasting around 28 days."
  },
  {
    q: "What are common causes of irregular periods?",
    a: "Common causes of irregular periods include hormonal imbalances, stress, excessive exercise, weight changes, thyroid disorders, and certain medical conditions."
  },
  {
    q: "How can I alleviate menstrual cramps?",
    a: "Menstrual cramps can be alleviated through various methods including over-the-counter pain relievers, applying heat to the abdomen, gentle exercise, relaxation techniques, and dietary changes."
  },
  {
    q: "What are the signs of a heavy menstrual flow?",
    a: "Signs of a heavy menstrual flow include soaking through one or more pads or tampons every hour for several consecutive hours, passing large blood clots, and experiencing symptoms like fatigue and shortness of breath."
  },
  {
    q: "Is it normal to experience mood swings during menstruation?",
    a: "Yes, it is common for some individuals to experience mood swings, irritability, or changes in mood before and during menstruation due to hormonal fluctuations."
  },
  {
    q: "How do I know if I have a menstrual disorder?",
    a: "Signs of a menstrual disorder include irregular periods, extremely heavy or light periods, severe menstrual cramps, prolonged periods, and other abnormal menstrual symptoms that interfere with daily life."
  },
  {
    q: "What are some natural remedies for PMS (premenstrual syndrome)?",
    a: "Natural remedies for PMS include dietary changes (such as reducing caffeine and increasing intake of fruits and vegetables), regular exercise, stress management techniques (such as yoga and meditation), and herbal supplements."
  },
  {
    q: "Can birth control affect my menstrual cycle?",
    a: "Yes, birth control methods such as hormonal contraceptives can regulate and sometimes even eliminate menstrual periods. However, they can also cause changes in menstrual flow and regularity."
  },
  {
    q: "What are the potential causes of missed periods other than pregnancy?",
    a: "Potential causes of missed periods other than pregnancy include stress, hormonal imbalances, excessive exercise, rapid weight loss or gain, thyroid disorders, polycystic ovary syndrome (PCOS), and certain medications."
  }
];

const GREETINGS = ["hi","hello","hey","hiya","good morning","good afternoon","good evening"];
const APPRECIATIONS = ["thanks","thank you","thx","thankyou","ty"];

const chatArea = document.getElementById("chatArea");
const form = document.getElementById("inputForm");
const input = document.getElementById("userInput");
const suggestList = document.getElementById("suggestList");

// populate suggestions
function renderSuggestions(){
  QUESTIONS.forEach(item=>{
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.textContent = item.q;
    btn.onclick = ()=> { setInputAndSend(item.q); };
    suggestList.appendChild(btn);
  });
}
function setInputAndSend(text){
  input.value = text;
  submitMessage(text);
}

// helpers
function appendMessage(text, who="bot"){
  const div = document.createElement("div");
  div.className = `msg ${who}`;
  div.textContent = text;
  chatArea.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// normalize question for matching
function normalize(str){
  return str.trim().replace(/\s+/g," ").replace(/[?.!]+$/,"").toLowerCase();
}

function isGreeting(text){
  const n = normalize(text);
  return GREETINGS.some(g => n === g || n.startsWith(g+" "));
}
function isAppreciation(text){
  const n = normalize(text);
  return APPRECIATIONS.some(t => n.includes(t));
}
function findAnswer(text){
  const n = normalize(text);
  for(const item of QUESTIONS){
    if(normalize(item.q) === n) return item.a;
  }
  return null;
}

function submitMessage(raw){
  const text = (raw !== undefined) ? raw : input.value;
  if(!text || !text.trim()) return;
  appendMessage(text, "user");
  input.value = "";

  // handle intents
  if(isGreeting(text)){
    appendMessage("Hi — how can I be of help to you today?");
    return;
  }
  if(isAppreciation(text)){
    appendMessage("Thanks — is there any question you might have?");
    return;
  }

  const ans = findAnswer(text);
  if(ans){
    appendMessage(ans);
    return;
  }

  // unknown -> suggest scheduling
  appendMessage("I don't have a direct answer to that. Would you like to schedule a meeting with a menstrual coach for deeper clarification? Type 'schedule' or click the link below.");
  const link = document.createElement("div");
  link.className = "msg bot";
  const mail = "mailto:menstrualcoach@example.com?subject=Schedule%20Meeting&body=Hi%2C%0A%0AI'd%20like%20to%20schedule%20a%20meeting%20to%20discuss%20my%20question.%0A%0AQuestion%3A%20" + encodeURIComponent(text);
  link.innerHTML = `Schedule a meeting: <a class="schedule" href="${mail}">Email a coach</a>`;
  chatArea.appendChild(link);
  chatArea.scrollTop = chatArea.scrollHeight;
}

form.addEventListener("submit", (e)=>{
  e.preventDefault();
  submitMessage();
});

input.addEventListener("keydown", (e)=>{
  if(e.key === "Enter" && !e.shiftKey){
    e.preventDefault();
    submitMessage();
  }
});

// initial bot greeting
appendMessage("Hello — I'm the Menstrual Health Bot. Ask me one of the suggested questions or type your own. For help scheduling a coach, ask 'schedule' or type your question.");
renderSuggestions();
// ...existing code...