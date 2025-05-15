#ifndef SECRETS_H
#define SECRETS_H

/**
 * @brief Secret key used for JWT (JSON Web Token) signing and verification
 * 
 * This key should be:
 * - At least 256 bits (32 characters) long for security
 * - Kept secret and never shared publicly
 * - Changed periodically following security best practices
 * 
 * Used in authentication and authorization processes.
 */
#define JWT_SECRET "your-256-very-secret-key"

#endif