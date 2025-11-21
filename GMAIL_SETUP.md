# How to Get Gmail Credentials for Development

To allow the backend to send emails using your Gmail account, you need to generate an **App Password**. This is more secure than using your real password and is required if you have 2-Step Verification enabled (which is recommended).

## Steps

1.  **Go to your Google Account**:
    *   Visit [https://myaccount.google.com/](https://myaccount.google.com/)
    *   Make sure you are logged into the account you want to use (`your_email@gmail.com`).

2.  **Enable 2-Step Verification** (if not already enabled):
    *   Click on **Security** in the left sidebar.
    *   Under "How you sign in to Google", look for **2-Step Verification**.
    *   If it's "Off", click it and follow the prompts to turn it on. (App Passwords require 2FA).

3.  **Generate an App Password**:
    *   In the search bar at the top of the page, type **"App passwords"** and select it.
    *   *Alternatively*, go to **Security** > **How you sign in to Google** > **2-Step Verification** > scroll to the bottom > **App passwords**.
    *   You may be asked to sign in again.

4.  **Create the Password**:
    *   **App name**: Enter a name like `CampusExchange` or `LocalDev`.
    *   Click **Create**.

5.  **Copy the Password**:
    *   A 16-character password will appear in a yellow bar (e.g., `xxxx xxxx xxxx xxxx`).
    *   **Copy this password**. You won't be able to see it again.

6.  **Update your `.env` file**:
    *   Open `/mnt/509086AD908698DC/CampusExchange/campus_exchange_backend/.env`.
    *   Paste the password into the `EMAIL_PASS` field (remove any spaces if you want, though usually spaces are ignored or handled, but best to paste it as one string or exactly as given).
    *   Update `EMAIL_USER` with your Gmail address.

    ```env
    EMAIL_USER=your_real_email@gmail.com
    EMAIL_PASS=xxxx xxxx xxxx xxxx
    ```

7.  **Save and Restart**:
    *   Save the `.env` file.
    *   The backend server should restart automatically.
    *   Try signing up again in the UI!
