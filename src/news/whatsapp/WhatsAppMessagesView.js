import React, { useEffect, useState } from "react";
import MessagesView from "../../common/components/messages/MessagesView";
import API from "../../dataEntryApp/api";
import ErrorMessage from "../../common/components/ErrorMessage";
import MessageService from "../../common/service/MessageService";
import Typography from "@material-ui/core/Typography";
import SendMessage from "./SendMessage";
import ReceiverType from "./ReceiverType";

function WhatsAppMessagesView({ receiverId, receiverType, receiverName }) {
  const [messages, setMessages] = useState([]);
  const [unsentMessages, setUnsentMessages] = useState([]);
  const [error, setError] = useState(null);
  const [userError, setUserError] = useState(null);

  useEffect(() => {
    if (receiverType === ReceiverType.Subject) {
      MessageService.getSubjectMessages(receiverId)
        .then(response => {
          if (response.status === 204) setUserError("Subject doesn't have phone number");
          else setMessages(response.data);
        })
        .catch(setError);

      API.getAllMessagesNotYetSentForSubject(receiverId)
        .then(unsentMessages => setUnsentMessages(unsentMessages))
        .catch(setError);
    } else if (receiverType === ReceiverType.User) {
      MessageService.getUserMessages(receiverId)
        .then(response => {
          if (response.status === 204) setUserError("User doesn't have phone number");
          else setMessages(response.data);
        })
        .catch(setError);

      API.getAllMessagesNotYetSentForUser(receiverId)
        .then(unsentMessages => setUnsentMessages(unsentMessages))
        .catch(setError);
    }
  }, []);

  return (
    <div>
      <SendMessage receiverId={receiverId} receiverType={receiverType} />
      <Typography variant={"h6"} style={{ paddingBottom: 10 }}>
        Messages for: {receiverName}
      </Typography>
      <ErrorMessage error={error} additionalStyle={{ marginBottom: 20 }} />
      {userError && (
        <Typography variant={"h5"} style={{ color: "red", marginBottom: 20 }}>
          {userError}
        </Typography>
      )}
      <MessagesView
        sentMessages={messages}
        msgsYetToBeSent={unsentMessages}
        isMsgsSentAvailable={true}
        isMsgsNotYetSentAvailable={true}
      />
    </div>
  );
}

export default WhatsAppMessagesView;