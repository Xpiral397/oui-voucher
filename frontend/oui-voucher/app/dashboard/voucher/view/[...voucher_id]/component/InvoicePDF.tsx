// components/InvoicePDF.tsx
"use client";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { User } from "@/contexts/types";
import { Fee } from "../page";
import logo from "@/public/logo.png";
interface Voucher {
  id: number;
  creator: User;
  created_for: User | null;
  fees: Fee[];
  timestamp: string;
  voucher_name: string;
  start_date: string;
  end_date: string;
  total_amount: string;
  values: string[];
}
import { toDate, formatDistanceToNow, parseISO } from "date-fns";
// utils.ts
export const generateToken = () => {
  return Array.from({ length: 24 }, () =>
    Math.random().toString(36).charAt(2)
  ).join("");
};

export const generateTransactionId = () => {
  return `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export const generateRefrenceID = () => {
  return `222-${Math.random().toString(36).substr(2, 11).toUpperCase()}`;
};

const styles = StyleSheet.create({
  watermark: {
    position: "absolute",
    top: "50%",
    left: "40%",
    transform: "translate(-50%, -50%) rotate(-45deg)", // Adjust as needed
    fontSize: 38,
    color: "rgba(255, 0, 0, 0.2)", // Semi-transparent red
    zIndex: 100,
  },
  page: {
    flexDirection: "column",
    padding: 20,
    backgroundImage: `url(${logo.src})`, // Replace with your pattern image path
    backgroundSize: "auto",
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 35,
    color: "blue",
  },
  logo: {
    width: 100,
    marginVertical: 10,
    alignSelf: "center",
  },
  section: {
    margin: 10,
    padding: 10,
    borderBottom: "1 solid #E5E7EB",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1F2937",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    fontSize: 10,
  },
  label: {
    fontWeight: "bold",
    color: "#4B5563",
  },
  value: {
    flex: 1,
    marginLeft: 5,
    color: "#374151",
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #E5E7EB",
    padding: 5,
    fontSize: 10,
  },
  tableHeader: {
    backgroundColor: "#F3F4F6",
  },
  tableCell: {
    flex: 1,
    padding: 5,
    color: "#374151",
  },
});

export const InvoicePDF: React.FC<any> = ({ voucher }) => {
  const transaction_id = voucher.transaction_id || generateTransactionId();
  const token = voucher.token || generateToken();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>OUI Voucher Invoice </Text>
        <Image src={logo.src} style={styles.logo} />
        <Text style={styles.title}>Voucher Invoice Credential</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voucher Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Voucher ID:</Text>
            <Text style={styles.value}>{voucher.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Transaction ID:</Text>
            <Text style={styles.value}>{transaction_id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Token:</Text>
            <Text style={styles.value}>{token}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Reference ID:</Text>
            <Text style={styles.value}>{generateRefrenceID()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Voucher Name:</Text>
            <Text style={styles.value}>{voucher.voucher_name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Total Amount:</Text>
            <Text style={styles.value}>{voucher.total_amount}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date Created:</Text>
            <Text style={styles.value}>
              {toDate(parseISO(voucher.timestamp as any)).toISOString()}
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {voucher.created_for ? "Created By" : "Created For Details"}
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>
              {voucher.creator.username + voucher.creator.other_name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Student ID:</Text>
            <Text style={styles.value}>{voucher.creator.matric_number}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Student level:</Text>
            <Text style={styles.value}>{voucher.creator.level}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Current Semester:</Text>
            <Text style={styles.value}>{voucher.semester}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Faculty:</Text>
            <Text style={styles.value}>{voucher.creator.faculty}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>{voucher.creator.department}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{voucher.creator.gender}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{voucher.creator.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Student Number:</Text>
            <Text style={styles.value}>{voucher.creator.telephone}</Text>
          </View>
        </View>
        {voucher.created_for && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>For:</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>
                {voucher.created_for.username + voucher.created_for.other_name}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Student ID:</Text>
              <Text style={styles.value}>
                {voucher.created_for.matric_number}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Student level:</Text>
              <Text style={styles.value}>{voucher.created_for.level}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Current Semester:</Text>
              <Text style={styles.value}>{voucher.semester}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Faculty:</Text>
              <Text style={styles.value}>{voucher.created_for.faculty}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Department:</Text>
              <Text style={styles.value}>{voucher.created_for.department}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Gender:</Text>
              <Text style={styles.value}>{voucher.created_for.gender}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{voucher.created_for.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Student Number:</Text>
              <Text style={styles.value}>{voucher.created_for.telephone}</Text>
            </View>
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Fee Name</Text>
              <Text style={styles.tableCell}>Amount</Text>
              <Text style={styles.tableCell}>Used</Text>
            </View>
            {voucher.fees.map((fee: Fee) => (
              <View style={styles.tableRow} key={fee.id}>
                <Text style={styles.tableCell}>{fee.name}</Text>
                <Text style={styles.tableCell}>{fee.amount}</Text>
                <Text style={styles.tableCell}>{"Payment Verified"}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
