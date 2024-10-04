function loadScript() {
  const startChatButton = document.getElementById('start-chat');
  const chatBox = document.getElementById('chat-box');
  const namePrompt = document.getElementById('name-prompt');

  startChatButton.addEventListener('click', function() {
      const user = document.getElementById('username-input').value.trim();
      if (!user) {
          alert("Please enter a valid name");
          return; 
      }

      namePrompt.style.display = 'none'; 
      chatBox.style.display = 'block'; 

      var pubnub = new PubNub({
          publishKey: 'demo',
          subscribeKey: 'demo',
          userId: user
      });

      pubnub.subscribe({
          channels: ['ws-channel']
      });

      pubnub.addListener({
          message: payload => {
              let messageString = '';
              const isCurrentUserPublisher = user === payload.publisher;
              const msg_cls = isCurrentUserPublisher ? 'sender-msg' : 'receiver-msg';

              messageString = `
                  <div class='${msg_cls} mb-2'>
                      <div class='d-inline'>${payload.message}</div>
                      <div class='d-inline text-dark fw-bold'>${payload.publisher}</div>
                  </div>
              `;

              document.getElementById('messages').innerHTML = messageString + document.getElementById('messages').innerHTML;
              const messagesDiv = document.getElementById('messages');
              messagesDiv.scrollTop = messagesDiv.scrollHeight; 
          }
      });

      document.getElementById('input-form').addEventListener('submit', function(event) {
          var inputMessage = document.getElementById('message');
          if (inputMessage.value) {
              pubnub.publish({
                  channel: 'ws-channel',
                  message: inputMessage.value
              });
              inputMessage.value = "";
              event.preventDefault();
          }
      });
  });
}

window.onload = loadScript;
