import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize")) || 10));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("employees")
      .select("*", { count: "exact" })
      .order("id", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const total = count ?? 0;
    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
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
