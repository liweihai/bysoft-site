import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let json_response = {
    status: "success",
  };
  return NextResponse.json(json_response);
}