import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function PUT(
  request: NextRequest,
    { params }: { params: Promise<{ id: string }> }

) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { employee_name, designation, salary } = body;

    if (!employee_name || !designation || salary === undefined) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (Number(salary) <= 0) {
      return NextResponse.json({ error: "Salary must be a positive number" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("employees")
      .update({ employee_name, designation, salary: Number(salary) })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update employee";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }

) {
  try {
    const { id } = await params;

    const { error } = await supabase.from("employees").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Employee deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete employee";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
