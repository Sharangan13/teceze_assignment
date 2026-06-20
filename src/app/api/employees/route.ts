import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch employees";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employee_no, employee_name, designation, salary } = body;

    if (!employee_no || !employee_name || !designation || salary === undefined) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (Number(salary) <= 0) {
      return NextResponse.json({ error: "Salary must be a positive number" }, { status: 400 });
    }

    // Check for duplicate employee_no
    const { data: existing } = await supabase
      .from("employees")
      .select("id")
      .eq("employee_no", employee_no)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Employee No already exists" }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("employees")
      .insert([{ employee_no, employee_name, designation, salary: Number(salary) }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create employee";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
