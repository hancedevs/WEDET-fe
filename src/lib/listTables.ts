import { supabase } from "./supabaseClient";

export async function listAllTables() {
    try {
        // Fetch all tables in the public schema
        const { data: tables, error: tableError } = await supabase
            .from("information_schema.tables")
            .select("table_name")
            .eq("table_schema", "public");

        if (tableError) {
            console.error("Error fetching tables:", tableError);
            return;
        }

        if (!tables || tables.length === 0) {
            console.log("No tables found");
            return;
        }

        const result: Record<string, any[]> = {};

        // Fetch columns for each table
        for (const table of tables) {
            const { data: columns, error: columnError } = await supabase
                .from("information_schema.columns")
                .select("column_name, data_type, is_nullable")
                .eq("table_name", table.table_name);

            if (columnError) {
                console.error(
                    `Error fetching columns for ${table.table_name}:`,
                    columnError
                );
                continue;
            }

            result[table.table_name] = columns;
        }

        console.log("All tables and columns:", result);
        return result;
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

// Example usage
listAllTables();
