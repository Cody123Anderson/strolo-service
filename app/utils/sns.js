import AWS from './aws';

const SNS = new AWS.SNS({apiVersion: '2010-03-31'});

export default SNS;
