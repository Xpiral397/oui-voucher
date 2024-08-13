"use client";
import React, { useState, useEffect } from "react";
import Logo from "@/public/logo.png"; // Adjust the import based on your project structure
import { jsPDF } from "jspdf";
import { v4 as uuidv4 } from "uuid"; // Import uuid library
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import {
  Analytics,
  DataUsage,
  Payment,
  Verified,
  Add,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { base } from "@/base";
import axios from "axios";
import { getToken } from "@/app/controller/auth/auth";

export function AdminList() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    axios
      .get(`${base}/accounts/admins/`)
      .then((response) => {
        setAdmins(response.data.admins);
      })
      .catch((error) => {
        toast.error("Failed to load admin data.");
        console.error("Error fetching admins:", error);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin List</h1>
      <table className="min-w-full bg-white dark:bg-gray-800 text-black dark:text-white">
        <thead>
          <tr>
            <th className="py-2">Admin Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Last Active</th>
            {/* <th className="py-2">Referred Admins</th> */}
          </tr>
        </thead>
        <tbody>
          {admins.map((admin: any, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{admin.admin_name}</td>
              <td className="py-2">{admin.email}</td>
              <td className="py-2">
                {admin.last_active
                  ? new Date(admin.last_active).toLocaleString()
                  : "Never"}
              </td>
              {/* <td className="py-2">
                <ul>
                  {admin.referred_admins.map((ref: any, refIndex: any) => (
                    <li key={refIndex}>
                      {ref.email} (Invited on{" "}
                      {new Date(ref.created_at).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BulkInvite() {
  const [emails, setEmails] = useState([""]);

  // Handle adding a new email input
  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  // Handle removing an email input
  const removeEmailField = (index: any) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  // Handle input change
  const handleEmailChange = (index: any, value: any) => {
    const updatedEmails = emails.map((email, i) =>
      i === index ? value : email
    );
    setEmails(updatedEmails);
  };

  const handleBulkInvite = async () => {
    try {
      // Make the API request
      const response = await axios.post(
        `${base}/accounts/invite-admin/`,
        {
          emails,
        },
        {
          headers: {
            Authorization: `Token ${getToken("Admin")}`,
          },
        }
      );

      // Check if the response contains specific issues
      if (
        response.data.already_exists &&
        response.data.already_exists.length > 0
      ) {
        toast.warn(
          `These emails already exist: ${response.data.already_exists.join(", ")}`
        );
      }

      if (response.data.banned && response.data.banned.length > 0) {
        toast.warn(
          `These emails are banned or restricted: ${response.data.banned.join(", ")}`
        );
      }

      if (response.data.failed && response.data.failed.length > 0) {
        toast.error(`Failed to invite: ${response.data.failed.join(", ")}`);
      } else {
        toast.success("All invitations sent successfully!");
      }
    } catch (error) {
      console.error("Error sending invitations:", error);
      toast.error("Failed to send invitations.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bulk Invite Admins</h1>
      {emails.map((email, index) => (
        <div key={index} className="mb-2 space-x-5 flex">
          <input
            type="text"
            className="w-full p-2 border rounded mr-2"
            placeholder={`Email ${index + 1}`}
            value={email}
            onChange={(e) => handleEmailChange(index, e.target.value)}
          />
          <button
            onClick={() => removeEmailField(index)}
            className="px-4 py-2 bg-red-500 text-white rounded"
            disabled={emails.length === 1}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={addEmailField}
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
      >
        Add Email
      </button>
      <button
        onClick={handleBulkInvite}
        className="ml-6 mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Send Invitations
      </button>
    </div>
  );
}

export default function Page() {
  return (
    <div className="flex flex-col w-full p-4 font-[Helvetica] tracking-wide text-warning-foreground">
      <Tabs aria-label="Options" color="primary" variant="bordered">
        <Tab
          key="List-admin"
          title={
            <div className="flex items-center space-x-2">
              <span>Administrators</span>
            </div>
          }
        >
          <Card>
            <CardBody className="dark:bg-slate-900">
              <AdminList />
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="Usage"
          title={
            <div className="flex items-center space-x-2">
              <Add />
              <span>New Admin</span>
            </div>
          }
        >
          <Card>
            <CardBody className="dark:bg-slate-900">
              <BulkInvite />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
