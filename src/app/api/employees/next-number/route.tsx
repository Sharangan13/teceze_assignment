import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select("employee_no")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    const currentNumber = data?.employee_no
      ? parseInt(data.employee_no.replace(/\D/g, ""), 10)
      : 0;

    return NextResponse.json({
      employee_no: `EMP${String(currentNumber + 1).padStart(3, "0")}`,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to compute employee number";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}