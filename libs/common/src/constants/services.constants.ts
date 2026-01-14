export const SERVICES ={
    API_GATEWAY: 'api-gateway',
    AUTH_SERVICE: 'auth-service',
    USERS_SERVICE: 'users-service',
    EVENTS_SERVICE: 'events-service',
    TICKETS_SERVICE: 'tickets-service',
    PAYMENTS_SERVICE: 'payments-service',
    NOTIFICATIONS_SERVICE: 'notifications-service'

} as const;

export const SERVICE_PORTS = {
    'api-gateway': 3000,
    'auth-service': 3001,
    'users-service': 3002,
    'events-service': 3003,
    'tickets-service': 3004,
    'payments-service': 3005,
    'notifications-service': 3006
} as const;