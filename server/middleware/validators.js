/**
 * Centralized Input Validation & Sanitization Middleware
 * 
 * Uses express-validator to validate and sanitize all user input.
 * Prevents: NoSQL injection, XSS, mass assignment, payload abuse.
 */
import { body, param, query, validationResult } from 'express-validator';

// ─── Constants ────────────────────────────────────────────────────────────────

const TASK_CATEGORIES = ['Study', 'Work', 'Household', 'Personal'];
const TASK_IMPORTANCE = ['Low', 'Medium', 'High', 'Critical'];
const TASK_STATUSES = ['Pending', 'In Progress', 'Completed', 'Failed'];
const TASK_TYPES = ['task', 'slot'];
const TIME_UNITS = ['mins', 'hrs'];
const OBJECTID_REGEX = /^[a-fA-F0-9]{24}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/; // HH:mm 24-hour format
const HEX_TOKEN_REGEX = /^[a-fA-F0-9]{40}$/;

// ─── Shared: Validation Error Handler ─────────────────────────────────────────

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// ─── Auth Validators ──────────────────────────────────────────────────────────

export const validateRegister = [
    body('name')
        .exists({ checkFalsy: true }).withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces')
        .escape(),

    body('email')
        .exists({ checkFalsy: true }).withMessage('Email is required')
        .isString().withMessage('Email must be a string')
        .isEmail().withMessage('Please provide a valid email')
        .isLength({ max: 254 }).withMessage('Email is too long')
        .normalizeEmail(),

    body('password')
        .exists({ checkFalsy: true }).withMessage('Password is required')
        .isString().withMessage('Password must be a string')
        .isLength({ min: 6, max: 128 }).withMessage('Password must be 6-128 characters'),

    handleValidationErrors
];

export const validateLogin = [
    body('email')
        .exists({ checkFalsy: true }).withMessage('Email is required')
        .isString().withMessage('Email must be a string')
        .isEmail().withMessage('Please provide a valid email')
        .isLength({ max: 254 }).withMessage('Email is too long')
        .normalizeEmail(),

    body('password')
        .exists({ checkFalsy: true }).withMessage('Password is required')
        .isString().withMessage('Password must be a string')
        .isLength({ max: 128 }).withMessage('Password is too long'),

    handleValidationErrors
];

export const validateForgotPassword = [
    body('email')
        .exists({ checkFalsy: true }).withMessage('Email is required')
        .isString().withMessage('Email must be a string')
        .isEmail().withMessage('Please provide a valid email')
        .isLength({ max: 254 }).withMessage('Email is too long')
        .normalizeEmail(),

    handleValidationErrors
];

export const validateResetPassword = [
    param('token')
        .exists().withMessage('Token is required')
        .isString().withMessage('Token must be a string')
        .matches(HEX_TOKEN_REGEX).withMessage('Invalid token format'),

    body('password')
        .exists({ checkFalsy: true }).withMessage('Password is required')
        .isString().withMessage('Password must be a string')
        .isLength({ min: 6, max: 128 }).withMessage('Password must be 6-128 characters'),

    handleValidationErrors
];

// ─── ObjectId Param Validator ─────────────────────────────────────────────────

export const validateObjectId = (paramName = 'id') => [
    param(paramName)
        .exists().withMessage(`${paramName} is required`)
        .isString().withMessage(`${paramName} must be a string`)
        .matches(OBJECTID_REGEX).withMessage(`Invalid ${paramName} format`),

    handleValidationErrors
];

export const validateUserIdParam = validateObjectId('userId');

// ─── Task Validators ─────────────────────────────────────────────────────────

export const validateTaskCreate = [
    body('title')
        .exists({ checkFalsy: true }).withMessage('Title is required')
        .isString().withMessage('Title must be a string')
        .trim()
        .isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 characters')
        .escape(),

    body('description')
        .optional({ values: 'falsy' })
        .isString().withMessage('Description must be a string')
        .trim()
        .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters')
        .escape(),

    body('category')
        .optional()
        .isString().withMessage('Category must be a string')
        .isIn(TASK_CATEGORIES).withMessage(`Category must be one of: ${TASK_CATEGORIES.join(', ')}`),

    body('importance')
        .optional()
        .isString().withMessage('Importance must be a string')
        .isIn(TASK_IMPORTANCE).withMessage(`Importance must be one of: ${TASK_IMPORTANCE.join(', ')}`),

    body('estimatedTime')
        .optional({ values: 'falsy' })
        .isNumeric().withMessage('Estimated time must be a number')
        .toFloat()
        .custom(val => val >= 0 && val <= 9999).withMessage('Estimated time must be 0-9999'),

    body('estimatedTimeUnit')
        .optional()
        .isString().withMessage('Time unit must be a string')
        .isIn(TIME_UNITS).withMessage(`Time unit must be one of: ${TIME_UNITS.join(', ')}`),

    body('assignedDate')
        .optional({ values: 'falsy' })
        .isISO8601().withMessage('Assigned date must be a valid date'),

    body('slotStart')
        .optional({ values: 'falsy' })
        .isString().withMessage('Slot start must be a string')
        .matches(TIME_REGEX).withMessage('Slot start must be in HH:mm format'),

    body('slotEnd')
        .optional({ values: 'falsy' })
        .isString().withMessage('Slot end must be a string')
        .matches(TIME_REGEX).withMessage('Slot end must be in HH:mm format'),

    body('status')
        .optional()
        .isString().withMessage('Status must be a string')
        .isIn(TASK_STATUSES).withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),

    body('type')
        .optional()
        .isString().withMessage('Type must be a string')
        .isIn(TASK_TYPES).withMessage(`Type must be one of: ${TASK_TYPES.join(', ')}`),

    handleValidationErrors
];

export const validateTaskUpdate = [
    param('id')
        .exists().withMessage('Task ID is required')
        .matches(OBJECTID_REGEX).withMessage('Invalid task ID format'),

    body('title')
        .optional()
        .isString().withMessage('Title must be a string')
        .trim()
        .isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 characters')
        .escape(),

    body('description')
        .optional()
        .isString().withMessage('Description must be a string')
        .trim()
        .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters')
        .escape(),

    body('category')
        .optional()
        .isString().withMessage('Category must be a string')
        .isIn(TASK_CATEGORIES).withMessage(`Category must be one of: ${TASK_CATEGORIES.join(', ')}`),

    body('importance')
        .optional()
        .isString().withMessage('Importance must be a string')
        .isIn(TASK_IMPORTANCE).withMessage(`Importance must be one of: ${TASK_IMPORTANCE.join(', ')}`),

    body('estimatedTime')
        .optional({ values: 'falsy' })
        .isNumeric().withMessage('Estimated time must be a number')
        .toFloat()
        .custom(val => val >= 0 && val <= 9999).withMessage('Estimated time must be 0-9999'),

    body('estimatedTimeUnit')
        .optional()
        .isString().withMessage('Time unit must be a string')
        .isIn(TIME_UNITS).withMessage(`Time unit must be one of: ${TIME_UNITS.join(', ')}`),

    body('assignedDate')
        .optional({ values: 'falsy' })
        .isISO8601().withMessage('Assigned date must be a valid date'),

    body('slotStart')
        .optional({ values: 'falsy' })
        .isString().withMessage('Slot start must be a string')
        .matches(TIME_REGEX).withMessage('Slot start must be in HH:mm format'),

    body('slotEnd')
        .optional({ values: 'falsy' })
        .isString().withMessage('Slot end must be a string')
        .matches(TIME_REGEX).withMessage('Slot end must be in HH:mm format'),

    body('status')
        .optional()
        .isString().withMessage('Status must be a string')
        .isIn(TASK_STATUSES).withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),

    body('type')
        .optional()
        .isString().withMessage('Type must be a string')
        .isIn(TASK_TYPES).withMessage(`Type must be one of: ${TASK_TYPES.join(', ')}`),

    body('failureReason')
        .optional()
        .isString().withMessage('Failure reason must be a string')
        .trim()
        .isLength({ max: 500 }).withMessage('Failure reason cannot exceed 500 characters')
        .escape(),

    handleValidationErrors
];

export const validateTaskQuery = [
    query('status')
        .optional()
        .isString().withMessage('Status must be a string')
        .isIn(TASK_STATUSES).withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),

    query('userId')
        .optional()
        .isString().withMessage('User ID must be a string')
        .matches(OBJECTID_REGEX).withMessage('Invalid user ID format'),

    handleValidationErrors
];

// ─── Field Whitelist Helpers ──────────────────────────────────────────────────

const ALLOWED_TASK_FIELDS = [
    'title', 'description', 'category', 'importance',
    'estimatedTime', 'estimatedTimeUnit', 'assignedDate',
    'slotStart', 'slotEnd', 'status', 'type', 'failureReason', 'userId'
];

/**
 * Picks only allowed fields from req.body to prevent mass assignment.
 * Call this AFTER validation middleware.
 */
export const pickAllowedFields = (body, allowedFields = ALLOWED_TASK_FIELDS) => {
    const sanitized = {};
    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            sanitized[field] = body[field];
        }
    }
    return sanitized;
};
