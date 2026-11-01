const z=require("zod");

const queSchema=z.object({
    title:z.string().trim().min(1),
    topic:z.string().trim().min(1),
    description:z.string().trim().min(1),
    difficulty:z.string().trim().pipe(z.enum(["Easy","Medium","Hard"])),
    company:z.string().trim().optional(),
    tags:z.array(z.string()).optional(),
    externalLink:z.string().url()
})

const updateSchema=queSchema.partial();

module.exports={queSchema,updateSchema};