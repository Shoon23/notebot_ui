import { IonPage, IonContent } from "@ionic/react";
import React from "react";
import ReactMarkdown from "react-markdown";

const Test = () => {
  const markdownText = `
# Software Engineering Overview\n\n## Key Phases\n\n1.  **Requirements Analysis:**\n    *   Define the purpose and context of the software.\n    *   Identify stakeholders and their needs.\n    *   Document requirements in a Software Requirements Specification (SRS).\n    *   Example: Determining that a banking app needs to allow users to check balances, transfer funds, and pay bills.\n\n2.  **Design:**\n    *   Translate requirements into a system architecture.\n    *   Specify components, modules, interfaces, and data.\n    *   Address security, performance, and scalability.\n    *   Example: Choosing a three-tier architecture with a presentation layer, application layer, and data layer.\n\n3.  **Implementation (Coding):**\n    *   Write source code based on the design.\n    *   Follow coding standards and best practices.\n    *   Use version control systems (e.g., Git).\n    *   Example: Writing Java code for the application layer.\n\n4.  **Testing:**\n    *   Verify that the software meets requirements.\n    *   Perform unit, integration, system, and acceptance testing.\n    *   Use testing frameworks and tools.\n    *   Example: Writing JUnit tests for individual methods.\n\n5.  **Deployment:**\n    *   Release the software to the intended environment.\n    *   Handle installation, configuration, and data migration.\n    *   Monitor performance and address issues.\n    *   Example: Deploying a web application to a cloud server.\n\n6.  **Maintenance:**\n    *   Address defects, enhancements, and updates.\n    *   Provide ongoing support and monitoring.\n    *   Manage changes and releases.\n    *   Example: Patching a security vulnerability or adding a new feature.\n\n## Software Development Models\n\n*   **Waterfall:** Linear, sequential approach. Suitable for well-defined requirements.\n\n    *   *Example*: A project with very stable and clearly understood requirements might use the Waterfall model.\n\n*   **Agile:** Iterative and incremental approach. Emphasizes collaboration and flexibility.\n\n    *   *Example*: Scrum, Kanban. A project where requirements are likely to change benefits from the Agile model.\n\n*   **Spiral:** Risk-driven approach. Suitable for complex and high-risk projects.\n\n    *   *Example*: Development of new operating system features.\n\n## Key Concepts\n\n*   **Software Requirements Specification (SRS):** A detailed description of the software's functionality, performance, and constraints.\n\n*   **Unified Modeling Language (UML):** A standardized notation for modeling software systems.\n\n*   **Version Control:** Managing changes to source code and other files (e.g., using Git).\n\n*   **Testing Levels:** Unit, integration, system, and acceptance testing.\n\n## Methodologies\n\n*   **Object-Oriented Programming (OOP):** A programming paradigm based on \"objects\" that contain data and code.\n\n    *Example*: Java, C++, Python\n\n*   **Service-Oriented Architecture (SOA):** Designing software as a collection of loosely coupled services.\n\n    *Example*: Web services using REST or SOAP.\n
`;
  return (
    <IonPage>
      <IonContent>
        <ReactMarkdown>{markdownText}</ReactMarkdown>
      </IonContent>
    </IonPage>
  );
};

export default Test;
