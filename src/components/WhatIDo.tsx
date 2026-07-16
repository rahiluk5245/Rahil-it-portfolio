import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (ScrollTrigger.isTouch) {
      containerRef.current.forEach((container) => {
        if (container) {
          container.classList.remove("what-noTouch");
          container.addEventListener("click", () => handleClick(container));
        }
      });
    }
    return () => {
      containerRef.current.forEach((container) => {
        if (container) {
          container.removeEventListener("click", () => handleClick(container));
        }
      });
    };
  }, []);
  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in" style={{ display: 'flex', height: '600px' }}>
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>
          <div
            className="what-content"
            style={{ width: '100%', height: '100%', minHeight: '100%', padding: '40px', overflow: 'hidden' }}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>

            <div className="what-content-in" style={{ overflowY: 'auto', paddingRight: '15px' }}>
              <h3 style={{ marginBottom: '20px' }}>MY EXPERTISE</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#fff', fontSize: '15px', letterSpacing: '0.5px' }}>IT Support & Help Desk:</strong>
                  <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '13px' }}>Level 1 & Level 2 Support, Desktop Support, End-User Support, Incident Management, Ticket Resolution, SLA Compliance, Remote Support</p>
                </li>
                <li style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#fff', fontSize: '15px', letterSpacing: '0.5px' }}>Microsoft Technologies:</strong>
                  <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '13px' }}>Windows 10/11, Microsoft 365, Outlook, Active Directory, Group Policy (Basic), Azure AD (Basic), Microsoft Office Suite</p>
                </li>
                <li style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#fff', fontSize: '15px', letterSpacing: '0.5px' }}>ERP Systems:</strong>
                  <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '13px' }}>Microsoft Dynamics NAV, Microsoft Dynamics 365 Business Central (BC365), LS Retail, Odoo, Tally ERP, QuickBooks</p>
                </li>
                <li style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#fff', fontSize: '15px', letterSpacing: '0.5px' }}>Hardware & Software:</strong>
                  <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '13px' }}>PC/Laptop Installation, Hardware Troubleshooting, Software Installation, Driver Installation, Printer & Scanner Support, POS Terminal Support</p>
                </li>
                <li style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#fff', fontSize: '15px', letterSpacing: '0.5px' }}>Networking:</strong>
                  <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '13px' }}>TCP/IP, DNS, DHCP, VPN, LAN/WAN, Wi-Fi Troubleshooting, Network Connectivity, Router & Switch Basics</p>
                </li>
                <li style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#fff', fontSize: '15px', letterSpacing: '0.5px' }}>Database & Reporting:</strong>
                  <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '13px' }}>SQL Server, Database Management, Data Validation, MIS Reporting, Advanced Microsoft Excel (Pivot Tables, VLOOKUP, XLOOKUP, Power Query)</p>
                </li>
                <li style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#fff', fontSize: '15px', letterSpacing: '0.5px' }}>Retail & POS Operations:</strong>
                  <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '13px' }}>POS Configuration, Item Master Management, Pricing & Promotions, Inventory Control, Sales Reconciliation, Stock Adjustments</p>
                </li>
                <li style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#fff', fontSize: '15px', letterSpacing: '0.5px' }}>ERP Functional Support:</strong>
                  <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '13px' }}>Sales, Purchase, Inventory, Finance, Warehouse Management, User Training, ERP Configuration</p>
                </li>
                <li style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#fff', fontSize: '15px', letterSpacing: '0.5px' }}>System Administration:</strong>
                  <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '13px' }}>User Account Management, System Configuration, Patch Management, Backup & Recovery, Performance Monitoring</p>
                </li>
                <li style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#fff', fontSize: '15px', letterSpacing: '0.5px' }}>Professional Skills:</strong>
                  <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '13px' }}>Problem Solving, Communication, Documentation, Vendor Coordination, Team Collaboration, Process Improvement, Customer Service</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);

    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}
