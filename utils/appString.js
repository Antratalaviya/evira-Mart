export const userTokenRole = {
    registerToken: 'register',//
    refreshToken: 'refresh',
    loginToken: 'login',//
    resetPassToken: 'reset_pass',//
    accessToken: 'access',
    adminAccessToken: 'admin_access'
}

export const AppString = {
    TOKEN_EXPIRE: 'token expire',
    INVALID_SESSION: 'session expire',
    INVALID_TOKEN: 'invalid token : token must be in format "Bearer token"',
    SOMETHING_WENT_WRONG: 'Something went wrong',

    DECRYPT_DATA_IS_REQ: 'Data to be Decrypt is required',

    USER_ALREADY_EXIST: 'User already exist with this email',
    USER_CREATED: 'User created Successfully',
    USER_NOT_EXIST: 'User not exist with this email',
    USER_IS_NOT_AUTHORIZED: "User is not authorized",
    USER_RETRIEVED: 'User retrieved successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
    USER_NOT_LOGIN: 'Please login first',

    PROFILE_INCOMPLETED: 'Profile is incomplete',
    PROFILE_STEP_1: 'Step 1 completed successfully',
    PROFILE_COMPLETED: 'Account set up Sccessfully',

    OTP_SENT: "Otp sent Successfully",
    OTP_VERIFIED: 'Otp verified Successfully',
    OTP_NOT_MATCHED: "Otp doesn't matched",
    OTP_EXPIRED: "Otp expire",

    INVALID_PASS: 'Password invalid',
    PASS_UPDATED: "Password updated successfully",
    PASS_NOT_MATCHED: 'confirm password should match password',

    ADMIN_NOT_FOUND: "Admin not exist with this email",

    CATEGORY_CREATED: 'Category created successfully',
    CATEGORY_RETRIEVED: 'Category retrieved successfully',
    CATEGORY_NOT_AVAILABLE: 'Category not available',

    PRODUCT_CREATED: "Product created successfully",
    PRODUCT_RETRIEVED: 'Product retrieved successfully',
    PRODUCT_LIKED: 'Product liked successfully',
    PRODUCT_UNLIKED: 'Product unliked successfully',
    PRODUCT_NOT_AVAILABLE_WISH: 'Product not available in wishlist',
    PRODUCT_NOT_AVAILABLE: 'Product not available',

    OPTION_CREATED: 'Product option created successfully',
    OPTION_NOT_AVAILABLE: 'Product option is not available',
    OPTION_DELETED: 'Product option deleted successfully',
    OPTION_RETRIVED: 'Product option retrieved successfully',
    OPTION_CAN_NOT_DELETE: 'Product option can not be deleted as it is default option',

    REVIEW_POSTED: 'Review posted successfully',
    REVIEW_LIKED: 'Review liked successfully',
    REVIEW_UNLIKED: 'Review unliked successfully',
    REVIEW_NOT_AVAILABLE: 'Review not available',
    REVIEW_RETRIEVED: 'Review retrieved successfully',

    CART_PROD_ADDED: 'Product added to cart successfully',
    CART_RETRIEVED: 'Cart product retrieved successfully',
    CART_PRODUCT_REMOVED: 'Cart Product removed successfully',
    CART_EMPTIED: 'Cart products emptied successfully',
    CART_PROD_QUEN_DEC: 'Cart product quentity decreased',
    CART_IS_EMPTY: 'Cart is empty'
}

export const Model = {
    userModel: 'User',
    otpModel: 'Otp',
    prodModel: 'Product',
    catModel: 'Category',
    reviewModel: 'Review',
    optionModel: 'Option',
    cartModel: 'Cart'
}