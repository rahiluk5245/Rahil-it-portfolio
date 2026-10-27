import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const projects = [
  {
    title: "IT Support & Help Desk",
    category: "Technical Support",
    tools:
      "Level 1 & Level 2 Support, Desktop Support, End-User Support, Incident Management, Ticket Resolution, SLA Compliance, Remote Support",
    image: "/images/Gemini_Generated_Image_j2izfbj2izfbj2iz (8)1.jpg",
  },
  {
    title: "Microsoft Technologies",
    category: "Systems & Infrastructure",
    tools:
      "Windows 10/11, Microsoft 365, Outlook, Active Directory, Group Policy (Basic), Azure AD (Basic), Microsoft Office Suite",
    image: "/images/Gemini_Generated_Image_j2izfbj2izfbj2iz (1).jpg",
  },
  {
    title: "ERP Systems",
    category: "Business Applications",
    tools:
      "Microsoft Dynamics NAV, Microsoft Dynamics 365 Business Central (BC365), LS Retail, Odoo, Tally ERP, QuickBooks",
    image: "/images/Gemini_Generated_Image_j2izfbj2izfbj2iz (2).jpg",
  },
  {
    title: "Hardware & Software",
    category: "Hardware & Software Support",
    tools:
      "PC/Laptop Installation, Hardware Troubleshooting, Software Installation, Driver Installation, Printer & Scanner Support, POS Terminal Support",
    image: "/images/Gemini_Generated_Image_j2izfbj2izfbj2iz (3).jpg",
  },
  {
    title: "Networking",
    category: "Infrastructure & Networking",
    tools:
      "TCP/IP, DNS, DHCP, VPN, LAN/WAN, Wi-Fi Troubleshooting, Network Connectivity, Router & Switch Basics",
    image: "/images/Gemini_Generated_Image_j2izfbj2izfbj2iz (4).jpg",
  },
  {
    title: "Database & Reporting",
    category: "Data & Reporting",
    tools:
      "SQL Server, Database Management, Data Validation, MIS Reporting, Advanced Microsoft Excel (Pivot Tables, VLOOKUP, XLOOKUP, Power Query)",
    image: "/images/Gemini_Generated_Image_j2izfbj2izfbj2iz (5).jpg",
  },
  {
    title: "Retail & POS Operations",
    category: "Retail Operations",
    tools:
      "POS Configuration, Item Master Management, Pricing & Promotions, Inventory Control, Sales Reconciliation, Stock Adjustments",
    image: "/images/Gemini_Generated_Image_j2izfbj2izfbj2iz (6).jpg",
  },
  {
    title: "ERP Functional Support",
    category: "ERP Functional Support",
    tools:
      "Sales, Purchase, Inventory, Finance, Warehouse Management, User Training, ERP Configuration",
    image: "/images/Gemini_Generated_Image_j2izfbj2izfbj2iz.jpg",
  },
  {
    title: "System Administration",
    category: "System Administration",
    tools:
      "User Account Management, System Configuration, Patch Management, Backup & Recovery, Performance Monitoring",
    image: "/images/Gemini_Generated_Image_j2izfbj2izfbj2iz (7).jpg",
  },
  {
    title: "Professional Skills",
    category: "Professional Skills",
    tools:
      "Problem Solving, Communication, Documentation, Vendor Coordination, Team Collaboration, Process Improvement, Customer Service",
    image: "/images/Gemini_Generated_Image_j2izfbj2izfbj2iz (9).jpg",
  },
];

const Work = () => {
  useGSAP(() => {
    if (window.innerWidth <= 1024) return;

    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      const workContainer = document.querySelector(".work-container");
      if (!box.length || !workContainer) return;
      const rectLeft = workContainer.getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parent = box[0].parentElement;
      const parentWidth = parent ? parent.getBoundingClientRect().width : window.innerWidth;
      const padding =
        parseInt(window.getComputedStyle(box[0]).padding) / 2 || 0;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: () => `+=${translateX > 0 ? translateX : 2000}`,
        scrub: true,
        pin: true,
        id: "work",
        invalidateOnRefresh: true,
      },
    });

    timeline.to(".work-flex", {
      x: () => -translateX,
      ease: "none",
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          Professional <span>Experience</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => {
            const indexStr = index < 9 ? `0${index + 1}` : `${index + 1}`;
            return (
              <div className="work-box" key={index}>
                <div className="work-info">
                  <div className="work-title">
                    <h3>{indexStr}</h3>
                    <div>
                      <h4>{project.title}</h4>
                      <p>{project.category}</p>
                    </div>
                  </div>
                  <h4>Tools & features</h4>
                  <p>{project.tools}</p>
                </div>
                <WorkImage image={project.image} alt={project.title} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Work;
