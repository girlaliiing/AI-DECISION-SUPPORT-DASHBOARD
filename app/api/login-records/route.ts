import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const filePath = path.join(process.cwd(), "loginRecords.json");

interface LoginRecord {
  name: string;
  date: string;
  time: string;
}

async function ensureFile() {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify([]));
  }
}

export async function GET() {
  try {
    await ensureFile();
    const fileData = await fs.readFile(filePath, "utf8");
    const records: LoginRecord[] = JSON.parse(fileData);
    return NextResponse.json(records);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to load login records" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureFile();

    const body: LoginRecord = await req.json();
    const fileData = await fs.readFile(filePath, "utf8");
    const records: LoginRecord[] = JSON.parse(fileData);

    // Add newest record on top
    records.unshift({
      name: body.name,
      date: body.date,
      time: body.time,
    });

    // Keep only last 20 entries (optional)
    const trimmed = records.slice(0, 20);

    await fs.writeFile(filePath, JSON.stringify(trimmed, null, 2));

    return NextResponse.json({ message: "Recorded" }, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to save login record" }, { status: 500 });
  }
}
