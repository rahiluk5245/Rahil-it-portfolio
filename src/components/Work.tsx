import { useState, useCallback } from "react";
import "./styles/Work.css";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const projects = [
  {
    title: "IT Support & Help Desk",
    category: "Technical Support",
    tools: "Level 1 & Level 2 Support, Desktop Support, End-User Support, Incident Management, Ticket Resolution, SLA Compliance, Remote Support",
    image: "/images/Solidx.png",
  },
  {
    title: "Microsoft Technologies",
    category: "Systems & Infrastructure",
    tools: "Windows 10/11, Microsoft 365, Outlook, Active Directory, Group Policy (Basic), Azure AD (Basic), Microsoft Office Suite",
    image: "/images/microsoft.png",
  },
  {
    title: "ERP Systems",
    category: "Business Applications",
    tools: "Microsoft Dynamics NAV, Microsoft Dynamics 365 Business Central (BC365), LS Retail, Odoo, Tally ERP, QuickBooks",
    image: "/images/erp.png",
  },
  {
    title: "Hardware & Software",
    category: "Hardware & Software Support",
    tools: "PC/Laptop Installation, Hardware Troubleshooting, Software Installation, Driver Installation, Printer & Scanner Support, POS Terminal Support",
    image: "/images/hardware.png",
  },
  {
    title: "Networking",
    category: "Infrastructure & Networking",
    tools: "TCP/IP, DNS, DHCP, VPN, LAN/WAN, Wi-Fi Troubleshooting, Network Connectivity, Router & Switch Basics",
    image: "/images/networking.png",
  },
  {
    title: "Database & Reporting",
    category: "Data & Reporting",
    tools: "SQL Server, Database Management, Data Validation, MIS Reporting, Advanced Microsoft Excel (Pivot Tables, VLOOKUP, XLOOKUP, Power Query)",
    image: "/images/database.png",
  },
  {
    title: "Retail & POS Operations",
    category: "Retail Operations",
    tools: "POS Configuration, Item Master Management, Pricing & Promotions, Inventory Control, Sales Reconciliation, Stock Adjustments",
    image: "/images/pos.png",
  },
  {
    title: "ERP Functional Support",
    category: "ERP Functional Support",
    tools: "Sales, Purchase, Inventory, Finance, Warehouse Management, User Training, ERP Configuration",
    image: "/images/erp_support.png",
  },
  {
    title: "System Administration",
    category: "System Administration",
    tools: "User Account Management, System Configuration, Patch Management, Backup & Recovery, Performance Monitoring",
    image: "/images/sysadmin.png",
  },
  {
    title: "Professional Skills",
    category: "Professional Skills",
    tools: "Problem Solving, Communication, Documentation, Vendor Coordination, Team Collaboration, Process Improvement, Customer Service",
    image: "/images/professional.png",
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          Professional<span> Experience</span>
        </h2>

        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Slides */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">
                          {project.category}
                        </p>
                        <div className="carousel-tools">
                          <span className="tools-label">Features</span>
                          <p>{project.tools}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
