// emails/templates.js

// emails/templates.js

export const userWelcomeTemplate = (user) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to FundHub</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
    <table role="presentation" style="width:100%;padding:20px 10px;">
      <tr>
        <td align="center">
          <table role="presentation" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.08);">
            <tr>
              <td>
                <!-- Header Section -->
                <div style="background:#111827;padding:40px 20px;text-align:center;">
                  <div style="background:#ffffff;width:70px;height:70px;margin:0 auto 20px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(0,0,0,0.15);">
                    <span style="font-size:36px;line-height:1;">🎯</span>
                  </div>
                  <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;">Welcome to FundHub</h1>
                  <p style="margin:8px 0 0;color:#e5e7eb;font-size:16px;">We’re excited to have you on board</p>
                </div>

                <!-- Main Body -->
                <div style="padding:35px 25px;">
                  <h2 style="margin:0 0 12px;color:#111827;font-size:20px;font-weight:700;">
                    Hi ${user.fullName} 👋
                  </h2>
                  <p style="margin:0 0 25px;color:#4b5563;font-size:15px;line-height:1.6;">
                    You’ve joined <strong style="color:#111827;">FundHub</strong> — a platform to create, support, and track campaigns that truly make a difference. 
                    We're thrilled to have you with us!
                  </p>

                  <div style="text-align:center;margin:30px 0;">
                    <a href="https://fundhub.com/login" style="background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;display:inline-block;">
                      Get Started
                    </a>
                  </div>

                  <p style="margin:0;color:#4b5563;font-size:14px;line-height:1.6;">
                    If you have any questions or need help, feel free to reply to this email — our support team will be happy to assist you.
                  </p>

                  <p style="margin:30px 0 0;color:#6b7280;font-size:13px;text-align:center;">
                    With ❤️ from the <strong>FundHub Team</strong>
                  </p>
                </div>

                <!-- Footer -->
                <div style="background:#f9fafb;padding:20px;text-align:center;">
                  <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.4;">
                    You’re receiving this email because you signed up for FundHub.<br/>
                    © ${new Date().getFullYear()} FundHub. All rights reserved.
                  </p>
                  <div style="margin-top:10px;">
                    <a href="https://fundhub.com" style="color:#2563eb;text-decoration:none;font-size:12px;">Visit Website</a> |
                    <a href="https://fundhub.com/unsubscribe" style="color:#2563eb;text-decoration:none;font-size:12px;">Unsubscribe</a>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const adminNewUserTemplate = (user) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New User Registered - FundHub</title>
  </head>
  <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 20px;">
    
    <table role="presentation" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);">
      <tr>
        <td>
          <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 30px;text-align:center;">
            <div style="background:#ffffff;width:60px;height:60px;margin:0 auto 20px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">
              <span style="font-size:32px;line-height:1;">🎉</span>
            </div>
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">New User Registered!</h1>
            <p style="margin:10px 0 0;color:rgba(255,255,255,0.9);font-size:16px;">A new member has joined FundHub</p>
          </div>

          <div style="padding:40px 30px;">
            <p style="margin:0 0 30px;color:#374151;font-size:16px;line-height:1.6;">
              Great news! A new user has successfully signed up on <strong style="color:#667eea;">FundHub</strong>. Here are their details:
            </p>

            <table role="presentation" style="width:100%;border-collapse:separate;border-spacing:0;background:linear-gradient(135deg,#f8f9ff 0%,#f3f4ff 100%);border-radius:12px;overflow:hidden;border:1px solid #e0e7ff;">
              <tr>
                <td style="padding:24px;">
                  <div style="margin-bottom:20px;">
                    <div style="display:flex;align-items:center;margin-bottom:6px;">
                      <span style="font-size:18px;margin-right:8px;">👤</span>
                      <span style="color:#6b7280;font-size:13px;font-weight:600;">Full Name</span>
                    </div>
                    <div style="color:#111827;font-size:18px;font-weight:600;padding-left:26px;">${user.name}</div>
                  </div>

                  <div style="margin-bottom:20px;">
                    <div style="display:flex;align-items:center;margin-bottom:6px;">
                      <span style="font-size:18px;margin-right:8px;">📧</span>
                      <span style="color:#6b7280;font-size:13px;font-weight:600;">Email Address</span>
                    </div>
                    <div style="color:#111827;font-size:16px;font-weight:500;padding-left:26px;">${user.email}</div>
                  </div>

                  <div style="margin-bottom:20px;">
                    <div style="display:flex;align-items:center;margin-bottom:6px;">
                      <span style="font-size:18px;margin-right:8px;">🏷️</span>
                      <span style="color:#6b7280;font-size:13px;font-weight:600;">User Role</span>
                    </div>
                    <div style="padding-left:26px;">
                      <span style="display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff;padding:6px 14px;border-radius:20px;font-size:14px;font-weight:600;">${user.role}</span>
                    </div>
                  </div>

                  <div>
                    <div style="display:flex;align-items:center;margin-bottom:6px;">
                      <span style="font-size:18px;margin-right:8px;">📅</span>
                      <span style="color:#6b7280;font-size:13px;font-weight:600;">Registration Date</span>
                    </div>
                    <div style="color:#111827;font-size:16px;font-weight:500;padding-left:26px;">
                      ${new Date(user.createdAt).toLocaleString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <div style="background:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0 0 10px;color:#9ca3af;font-size:14px;">
              This is an automatic notification from <strong style="color:#667eea;">FundHub</strong>.
            </p>
            <p style="margin:0;color:#d1d5db;font-size:13px;">
              © ${new Date().getFullYear()} FundHub. All rights reserved.
            </p>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
