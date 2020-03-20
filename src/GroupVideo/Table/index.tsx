import React, { useEffect, useState } from 'react';
import { getSpeechRecognition } from '../../SpeechRecognition';
import { sendAudioTranscript } from '../../services';
import { useInterval } from '../../hooks';
import './index.css';

type PropTypes = {
  tableId: string,
};

let speechRecognition: SpeechRecognition;
let finalTranscript = "";

function Table({
  tableId,
}: PropTypes) {
  const [interimTranscript, setInterimTranscript] = useState("");

  useEffect(() => {
    speechRecognition = getSpeechRecognition();
    speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
      Array.from(event.results).forEach(result => {
        const transcript= result[0].transcript;
        if (result.isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          setInterimTranscript(transcript);
        }
      });
    };
    speechRecognition.onend = () => speechRecognition.start();
    speechRecognition.start();

    return () => {
      speechRecognition.stop();
    };
  }, [tableId]);

  useInterval(async () => {
    if (!!finalTranscript && await sendAudioTranscript(finalTranscript, tableId)) {
        finalTranscript = '';
    }
  }, 1000);

  return (
    <div className="group-video-table">
      {interimTranscript}
    </div>
  )
}

export default Table;
