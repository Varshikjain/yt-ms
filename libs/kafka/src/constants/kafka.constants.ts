export const KAFKA_BROKERS = process.env.KAFKA_BROKERS ?? 'localhost:9092'
export const KAFKA_CLIENT_ID = 'eventflowapp'
export const KAFKA_CONSUMER_GROUP = 'eventflowapp-consumer'

//KAFKA TOPICS
export const KAFKA_TOPICS = {
  USER_REGISTERED: 'user.registered',
  USER_LOGIN : 'user.login',
  PASSWORD_RESET_REQUESTED: 'user.password-reset-requested',

  //event events
  EVENT_CREATED: 'event.created',
  EVENT_UPDATED: 'event.updated',
  EVENT_CANCELLED: 'event.cancelled',

    //ticket events
  TICKET_CREATED: 'ticket.created',
  TICKET_CANCELLED: 'ticket.cancelled',
  TICKET_CHECKED_IN: 'ticket.checked-in',

  //PAYMENT EVENTS
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_REFUNDED: 'payment.refunded',

    //notification events
  SEND_EMAIL: 'notification.send-email',
  SEND_PUSH: 'notification.send-push',
} as const;

export type KafkaTopics = typeof KAFKA_TOPICS[keyof typeof KAFKA_TOPICS];