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
    
    <!-- Main Container -->
    <table role="presentation" style="width:100%;padding:20px 10px;">
      <tr>
        <td align="center">
          <table role="presentation" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.08);">
            <tr>
              <td>
                
                <!-- Header -->
                <div style="background:#111827;padding:40px 20px;text-align:center;">
                  <div style="background:#ffffff;width:70px;height:70px;margin:0 auto 20px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(0,0,0,0.15);">
                    <span style="font-size:36px;line-height:1;">🎯</span>
                  </div>
                  <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;">Welcome to FundHub</h1>
                  <p style="margin:8px 0 0;color:#e5e7eb;font-size:16px;">We’re excited to have you on board</p>
                </div>

                <!-- Main Content -->
                <div style="padding:35px 25px;">
                  
                  <!-- Greeting -->
                  <h2 style="margin:0 0 12px;color:#111827;font-size:20px;font-weight:700;">
                    Hi ${user.name} 👋
                  </h2>
                  <p style="margin:0 0 25px;color:#4b5563;font-size:15px;line-height:1.6;">
                    You’ve joined <strong style="color:#111827;">FundHub</strong> — a platform to create, support, and track campaigns that matter. Let’s get started on this journey together!
                  </p>

                  <!-- Account Details -->
                  <div style="background:#f9fafb;border-radius:8px;padding:20px;border:1px solid #e5e7eb;margin-bottom:30px;">
                    <h3 style="margin:0 0 15px;color:#374151;font-size:15px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">
                      📋 Your Account Details
                    </h3>
                    <table role="presentation" style="width:100%;border-collapse:collapse;">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                          <span style="color:#6b7280;font-size:13px;font-weight:600;">Email Address</span>
                        </td>
                        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">
                          <span style="color:#111827;font-size:14px;font-weight:600;">${user.email}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="color:#6b7280;font-size:13px;font-weight:600;">Member Since</span>
                        </td>
                        <td style="padding:8px 0;text-align:right;">
                          <span style="color:#111827;font-size:14px;font-weight:600;">
                            ${new Date(user.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric'
                            })}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Quick Start -->
                  <div>
                    <h3 style="margin:0 0 15px;color:#374151;font-size:16px;font-weight:700;">
                      🚀 Quick Start Guide
                    </h3>
                    <div style="margin-bottom:14px;padding-left:26px;position:relative;">
                      <div style="position:absolute;left:0;top:3px;width:18px;height:18px;background:#111827;border-radius:50%;color:#fff;text-align:center;line-height:18px;font-size:11px;font-weight:700;">1</div>
                      <div style="color:#374151;font-size:14px;font-weight:600;margin-bottom:3px;">Explore Your Dashboard</div>
                      <div style="color:#6b7280;font-size:13px;line-height:1.5;">Discover tools and features available for you</div>
                    </div>
                    <div style="margin-bottom:14px;padding-left:26px;position:relative;">
                      <div style="position:absolute;left:0;top:3px;width:18px;height:18px;background:#111827;border-radius:50%;color:#fff;text-align:center;line-height:18px;font-size:11px;font-weight:700;">2</div>
                      <div style="color:#374151;font-size:14px;font-weight:600;margin-bottom:3px;">Create Your First Campaign</div>
                      <div style="color:#6b7280;font-size:13px;line-height:1.5;">Share your story and start making an impact</div>
                    </div>
                    <div style="padding-left:26px;position:relative;">
                      <div style="position:absolute;left:0;top:3px;width:18px;height:18px;background:#111827;border-radius:50%;color:#fff;text-align:center;line-height:18px;font-size:11px;font-weight:700;">3</div>
                      <div style="color:#374151;font-size:14px;font-weight:600;margin-bottom:3px;">Connect & Support</div>
                      <div style="color:#6b7280;font-size:13px;line-height:1.5;">Find and support campaigns that inspire you</div>
                    </div>
                  </div>

                  <!-- Help Section -->
                  <div style="background:#f9fafb;border-radius:8px;padding:18px;text-align:center;border:1px solid #e5e7eb;margin-top:35px;">
                    <p style="margin:0 0 10px;color:#6b7280;font-size:14px;line-height:1.5;">
                      Need help getting started? We’re here for you!
                    </p>
                    <a href="#" style="color:#111827;text-decoration:none;font-weight:600;font-size:14px;margin:0 8px;">Help Center</a>
                    <span style="color:#d1d5db;">•</span>
                    <a href="#" style="color:#111827;text-decoration:none;font-weight:600;font-size:14px;margin:0 8px;">Contact Support</a>
                  </div>
                </div>

                <!-- Footer -->
                <div style="background:#f9fafb;padding:25px;text-align:center;border-top:1px solid #e5e7eb;">
                  <p style="margin:0 0 10px;color:#6b7280;font-size:13px;line-height:1.5;">
                    You’re receiving this email because you signed up on <strong>FundHub</strong>.
                  </p>
                  <div style="margin:10px 0;">
                    <a href="#" style="margin:0 6px;color:#9ca3af;text-decoration:none;font-size:12px;">Privacy Policy</a>
                    <span style="color:#d1d5db;">•</span>
                    <a href="#" style="margin:0 6px;color:#9ca3af;text-decoration:none;font-size:12px;">Terms of Service</a>
                    <span style="color:#d1d5db;">•</span>
                    <a href="#" style="margin:0 6px;color:#9ca3af;text-decoration:none;font-size:12px;">Unsubscribe</a>
                  </div>
                  <p style="margin:10px 0 0;color:#d1d5db;font-size:12px;">
                    © ${new Date().getFullYear()} FundHub. All rights reserved.
                  </p>
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
