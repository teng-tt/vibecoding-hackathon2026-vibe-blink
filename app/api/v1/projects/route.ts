/**
 * Projects API v1
 * 
 * RESTful API for managing Blink projects
 * Endpoints:
 * - GET /api/v1/projects - Get all projects
 * - GET /api/v1/projects?id=<id> - Get specific project
 * - POST /api/v1/projects - Create new project
 * - PUT /api/v1/projects - Update project
 * - DELETE /api/v1/projects?id=<id> - Delete project
 */

import { NextRequest, NextResponse } from "next/server";
import {
  addProject,
  getAllProjects,
  getProjectById,
  deleteProject,
  updateProject,
  Project,
  initializeDatabase,
} from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const project = await getProjectById(id);
      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(project);
    } else {
      const projects = await getAllProjects();
      return NextResponse.json(projects);
    }
  } catch (error) {
    console.error("Error in GET /api/v1/projects:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Internal server error",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const body = await request.json();

    const project: Project = {
      id: body.id || `project-${Date.now()}`,
      name: body.name || "未命名项目",
      description: body.description || "",
      wallet: body.wallet || "",
      link: body.link || "",
      volume: parseFloat(body.volume) || 0,
      txs: parseInt(body.txs) || 0,
    };

    const result = await addProject(project);
    if (result) {
      return NextResponse.json(project, { status: 201 });
    } else {
      return NextResponse.json(
        {
          error: "Failed to add project",
          details: "Database operation failed",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in POST /api/v1/projects:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Internal server error",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await initializeDatabase();

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    if (await updateProject(id, updates)) {
      const project = await getProjectById(id);
      return NextResponse.json(project);
    } else {
      return NextResponse.json(
        { error: "Failed to update project" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in PUT /api/v1/projects:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Internal server error",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await initializeDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    if (await deleteProject(id)) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to delete project" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in DELETE /api/v1/projects:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Internal server error",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
