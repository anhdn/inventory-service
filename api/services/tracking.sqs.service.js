const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_REGION });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const queueUrl = process.env.QUEUE_URL;

const app = express();

app.use(bodyParser.json());

const pushTrackingEvent = (payload) => {
  const params = {
    MessageBody: JSON.stringify({
      eventType: 'search',
      payload: {
        search: payload,
      },
    }),
    QueueUrl: queueUrl,
  };
  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('[TRACKING] - Search Message Added Successfully', data.MessageId);
    }
  });
};

module.exports = { pushTrackingEvent };
